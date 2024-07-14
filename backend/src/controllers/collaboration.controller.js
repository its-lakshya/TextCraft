import mongoose from 'mongoose';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { Document } from '../models/document.model.js';
import { Collaboration } from '../models/collaboration.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

const addCollaborator = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { email, accessType } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unathorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid of missing document id');
  }

  if (!email || email.trim() === '') {
    throw new apiError(400, 'Email is missing');
  }

  if (accessType !== 'read' && accessType !== 'write' && accessType) {
    throw new apiError(400, 'Invalid accessType');
  }

  const document = await Document.findById(documentId);

  if (!document) {
    throw new apiError(400, 'Document does not exist');
  }

  const collaborator = await User.findOne({ email });

  if (!collaborator) {
    throw new apiError(400, 'User with this email does not exists');
  }

  const collab = await Collaboration.create({
    document,
    collaborator,
    accessType: accessType || 'read',
  });

  const createdCollaborator = await Collaboration.findById(collab._id);

  if (!createdCollaborator) {
    throw new apiError(500, 'Something went wrong while adding the collaborator');
  }

  return res
    .status(200)
    .json(new apiResponse(200, createdCollaborator, 'Collaborator added successfully'));
});

const removeCollaborator = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { email } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unathorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid of missing document id');
  }

  if (!email || email.trim() === '') {
    throw new apiError(400, 'Email is missing');
  }

  const document = await Document.findById(documentId);

  if (!document) {
    throw new apiError(400, 'Document does not exist');
  }

  const collaborator = await User.findOne({ email });

  if (!collaborator) {
    throw new apiError(400, 'User with this email does not exists');
  }

  const removedCollaborator = await Collaboration.findOneAndDelete({document, collaborator}, {
    new: true,
  });

  if (!removedCollaborator) {
    throw new apiError(500, 'Something went wrong while removeing the collaborator');
  }

  return res.status(200).json(new apiResponse(200, 'Collaborator removed successfully'));
});

export { addCollaborator, removeCollaborator };
