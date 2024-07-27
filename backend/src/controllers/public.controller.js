import mongoose from 'mongoose';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { Document } from '../models/document.model.js';
import { Collaboration } from '../models/collaboration.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Public } from '../models/public.model.js';

const toggleIsPublic = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing documentId');
  }

  const document = await Document.findById(documentId);

  if (!document.owner.equals(user._id)) {
    throw new apiError(405, 'User is unauthorized to set public status this document');
  }

  const alreadyPublic = await Public.findOne({ document });

  if (alreadyPublic) {
    await Public.findOneAndDelete({ document });

    return res
      .status(200)
      .json(
        new apiResponse(200, { isPublic: false }, 'Access Status is set to private successfully'),
      );
  }

  const publicDocument = await Public.create({ document });

  if (!publicDocument) {
    throw new apiError(500, 'Something went wrong while setting document to public');
  }

  return res
    .status(200)
    .json(new apiResponse(200, { isPublic: true }, 'Access Status is set to public successfully'));
});

const setPublicAccessType = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { accessType } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Either invalid of missing document id');
  }
  if (!accessType || accessType.trim() === '') {
    throw new apiError(400, 'Pubic access types is required');
  }

  if (accessType !== 'read' && accessType !== 'write') {
    throw new apiError(400, 'Invalid public access types is required');
  }

  const document = await Document.findById(documentId);
  if (!document.owner.equals(user._id)) {
    throw new apiError(405, 'User is unauthorized to rename this document');
  }

  const collaboration = await Public.findOneAndUpdate({ documentId, accessType });

  if (!collaboration) {
    throw new apiError(
      401,
      'Document is private, private documents you can not set public access types',
    );
  }

  return res
    .status(200)
    .json(new apiResponse(200, collaboration, 'Public access type of the document is updated successfully'));
});

const getPublicAccessInformation = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Either invalid of missing document id');
  }

  const document = await Document.findById(documentId);
  const publicInformation = await Public.findOne({ document });

  if (!publicInformation) {
    throw new apiError(405, 'Document is private');
  }

  return res.status(200).json(new apiResponse(200, publicInformation));
});

export { toggleIsPublic, setPublicAccessType, getPublicAccessInformation };
