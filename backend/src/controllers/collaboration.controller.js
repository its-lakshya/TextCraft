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

  if (!document.owner.equals(user._id))
    throw new apiError(400, 'User not authorized to add collaborator');

  if (!document) {
    throw new apiError(400, 'Document does not exist');
  }

  const collaborator = await User.findOne({ email });

  if (!collaborator) {
    throw new apiError(400, 'User with this email does not exists');
  }

  const alreadyCollaborator = await Collaboration.findOne({ document, collaborator });

  if (alreadyCollaborator) {
    throw new apiError(400, 'User is already a collaborator');
  } else {
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
  }
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

  if (!document.owner.equals(user._id))
    throw new apiError(400, 'User not authorized to remove collaborator');

  if (!document) {
    throw new apiError(400, 'Document does not exist');
  }

  const collaborator = await User.findOne({ email });

  if (!collaborator) {
    throw new apiError(400, 'User with this email does not exists');
  }

  const removedCollaborator = await Collaboration.findOneAndDelete(
    { document, collaborator },
    {
      new: true,
    },
  );

  if (!removedCollaborator) {
    throw new apiError(500, 'Something went wrong while removeing the collaborator');
  }

  return res.status(200).json(new apiResponse(200, 'Collaborator removed successfully'));
});

const updateAccessTypes = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { email, accessType } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing documentId');
  }

  if (!email || email.trim() === '') {
    throw new apiError(400, 'Email is missing');
  }

  if (!accessType) {
    throw new apiError(400, 'Missing accessType ');
  }

  if (accessType && accessType !== 'read' && accessType !== 'write') {
    throw new apiError(400, 'Invalid accessType');
  }

  const document = await Document.findById(documentId);

  if (!document.owner.equals(user._id))
    throw new apiError(400, 'User not authorized to update access types');

  if (!document) {
    throw new apiError(400, 'No such document found');
  }

  const collaborator = await User.findOne({ email });

  if (!collaborator) {
    throw new apiError(400, 'No such collaborator exists');
  }

  const collaboratorAccessType = await Collaboration.findOneAndUpdate(
    { document, collaborator },
    { accessType: accessType },
    { new: true },
  );

  if (!collaboratorAccessType) {
    throw new apiError(500, 'Something went wrong while updating the access types');
  }

  return res
    .status(200)
    .json(new apiResponse(200, collaboratorAccessType, 'Access type updated successfully'));
});

const getAllCollaborators = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing documentId');
  }

  const document = await Document.findById(documentId);

  if (!document) {
    throw new apiError(400, 'No such document exists');
  }

  const collaborators = await Document.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(documentId),
      },
    },
    {
      $project: {
        documentName: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        owner: 0,
      },
    },
    {
      $lookup: {
        from: 'collaborations',
        localField: '_id',
        foreignField: 'document',
        as: 'collab',
        pipeline: [
          {
            $project: {
              accessType: 1,
              collaborator: 1,
              _id: 0,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'collaborator',
              foreignField: '_id',
              as: 'collaboratorDetails',
              pipeline: [
                {
                  $project: {
                    createdAt: 0,
                    updatedAt: 0,
                    gender: 0,
                    password: 0,
                    refreshToken: 0,
                    __v: 0,
                  },
                },
              ],
            },
          },
          {
            $unwind: { path: '$collaboratorDetails', preserveNullAndEmptyArrays: true },
          },
          {
            $addFields: {
              _id: '$collaboratorDetails._id',
              userName: '$collaboratorDetails.userName',
              email: '$collaboratorDetails.email',
              fullName: '$collaboratorDetails.fullName',
              profileImage: '$collaboratorDetails.profileImage',
            },
          },
          {
            $project: {
              collaboratorDetails: 0,
              collaborator: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: '$collab',
    },
    {
      $replaceRoot: { newRoot: '$collab' },
    },
  ]);

  if (!collaborators) {
    throw new apiError(500, 'Something went wrong while fetching the collaborators');
  }

  return res
    .status(200)
    .json(new apiResponse(200, collaborators, 'Collaborators fetched successfully'));
});

const getCollaboratorsAccessType = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { email } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing documentId');
  }

  if (!email || email.trim() === '') {
    throw new apiError(400, 'Email is missing');
  }

  const document = await Document.findById(documentId);

  if (!document) {
    throw new apiError(400, 'No such document found');
  }

  const collaborator = await User.findOne({ email });

  if (!collaborator) {
    throw new apiError(400, 'No such collaborator exists');
  }

  const AccessType = await Collaboration.findOne({ document, collaborator });

  if (!AccessType) {
    throw new apiError(500, 'Something went wrong while fetching the collaborators access type');
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, AccessType.accessType, 'Collaborator access types fetched successfully'),
    );
});

export {
  addCollaborator,
  removeCollaborator,
  updateAccessTypes,
  getAllCollaborators,
  getCollaboratorsAccessType,
};
