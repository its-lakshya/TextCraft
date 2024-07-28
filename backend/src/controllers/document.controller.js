import mongoose, { mongo } from 'mongoose';
import { Document } from '../models/document.model.js';
import { Collaboration } from '../models/collaboration.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';

const createDocument = asyncHandler(async (req, res) => {
  const { documentName } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!documentName || documentName.trim() === '') {
    throw new apiError(400, 'Missing document name');
  }

  const document = await Document.create({
    documentName,
    owner: user,
  });

  const createdDocument = await Document.findById(document._id);

  if (!createdDocument) {
    throw new apiError(500, createDocument, 'Something went wrong while creating the document');
  }

  return res
    .status(200)
    .json(new apiResponse(200, createdDocument, 'Document created successfully'));
});

const getUserDocuments = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  const documents = await Document.find({ owner: user });

  if (!documents) {
    throw new apiError(500, 'Something went wrong while fetching the documents');
  }

  return res.status(200).json(new apiResponse(200, documents, 'Documents fetched successfully'));
});

const getDocumentByID = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing document id');
  }

  const document = await Document.findById(documentId);

  // const document = await Document.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(documentId),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'collaborations',
  //       localField: '_id',
  //       foreignField: 'document',
  //       as: 'collaborators',
  //       pipeline: [
  //         {
  //           $project: {
  //             _id: 0,
  //             document: 0,
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ]);
  const collaborators = await Collaboration.find({ document: document });

  if (document.owner.equals(user._id)) {
    return res
      .status(200)
      .json(new apiResponse(200, { document, isOwner: true }, 'Document fetched successfully'));
  }

  const collaboration = await Collaboration.findOne({ document, collaborator: user });

  if (collaboration) {
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { document, isOwner: false, accessType: collaboration.accessType },
          'Document fetched successfully',
        ),
      );
  }

  const isPublic = await Collaboration.findOne({ document, isPublic: true });

  if (!isPublic) {
    throw new apiError(400, 'User have no access to the document');
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { document, isOwner: false, accessType: isPublic.publicAccessType },
        'Document is public',
      ),
    );
});

const renameDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { documentName } = req.body;

  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unaithorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Either invalid of missing document id');
  }

  const document = await Document.findById(documentId);
  if (!document.owner.equals(user._id)) {
    throw new apiError(401, 'User is unauthorized to rename this document');
  }

  const documentRenamed = await Document.findByIdAndUpdate(
    documentId,
    { documentName },
    { new: true },
  );

  if (!documentRenamed) {
    throw new apiError(500, 'Something went wrong while renaming the document');
  }

  return res
    .status(200)
    .json(new apiResponse(200, documentRenamed, 'Document renamed successfully'));
});

const updateDocumentContent = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing document id');
  }

  if (!content) {
    throw new apiError(400, 'Change content is required');
  }

  const document = await Document.findByIdAndUpdate(documentId, { content }, { new: true });

  if (!document) {
    throw new apiError(500, 'Something went wrong while updating the content of the document');
  }

  return res
    .status(200)
    .json(new apiResponse(200, document, "Document's content updated successfully"));
});

const deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing document id');
  }

  const document = await Document.findById(documentId);
  if (!document.owner.equals(user._id)) {
    throw new apiError(401, 'User is not authorized to delete the document');
  }

  const collaborations = await Collaboration.deleteMany({ document });

  if (!collaborations) {
    throw new apiError(500, 'Something went wrong while deleting the document');
  }

  const documentDeleted = await Document.findByIdAndDelete(documentId);

  if (!documentDeleted) {
    throw new apiError(500, 'Something went wrong while deleting the document');
  }

  return res.status(200).json(new apiResponse(200, 'Document deleted successfully'));
});

const getSharedDocuments = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  const sharedDocuments = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: 'collaborations',
        localField: '_id',
        foreignField: 'collaborator',
        as: 'data',
        pipeline: [
          {
            $lookup: {
              from: 'documents',
              localField: 'document',
              foreignField: '_id',
              as: 'documents',
            },
          },
          {
            $project: {
              documents: {
                $arrayElemAt: ['$documents', 0], // Get the first element of the 'documents' array
              },
              _id: 0,
            },
          },
          {
            $replaceRoot: { newRoot: '$documents' }, // Replace the root document with 'documents'
          },
        ],
      },
    },
    {
      $project: {
        data: 1,
        _id: 0,
      },
    },
    {
      $unwind: '$data', // Unwind the 'data' array to access each document individually
    },
    {
      $replaceRoot: { newRoot: '$data' }, // Replace the root document with 'data'
    },
  ]);

  if (!sharedDocuments) {
    throw new apiError(500, 'Something went wrong while fetching shared documents');
  }

  return res
    .status(200)
    .json(new apiResponse(200, sharedDocuments, 'Shared documents fetched successfully'));
});

const getAllDocuments = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  const documents = await Document.find({ owner: user });

  if (!documents) {
    throw new apiError(500, 'Something went wrong while fetching the documents');
  }

  const sharedDocuments = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: 'collaborations',
        localField: '_id',
        foreignField: 'collaborator',
        as: 'data',
        pipeline: [
          {
            $lookup: {
              from: 'documents',
              localField: 'document',
              foreignField: '_id',
              as: 'documents',
            },
          },
          {
            $project: {
              documents: {
                $arrayElemAt: ['$documents', 0], // Get the first element of the 'documents' array
              },
              _id: 0,
            },
          },
          {
            $replaceRoot: { newRoot: '$documents' }, // Replace the root document with 'documents'
          },
        ],
      },
    },
    {
      $project: {
        data: 1,
        _id: 0,
      },
    },
    {
      $unwind: '$data', // Unwind the 'data' array to access each document individually
    },
    {
      $replaceRoot: { newRoot: '$data' }, // Replace the root document with 'data'
    },
  ]);

  if (!sharedDocuments) {
    throw new apiError(500, 'Something went wrong while fetching shared documents');
  }

  const allDocuments = [...documents, ...sharedDocuments];

  return res.status(200).json(new apiResponse(200, allDocuments, 'Documents fetched successfully'));
});

const getDocumentOwner = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;

  if (!user) throw new apiError(401, 'Unauthorized request');

  if (!mongoose.isValidObjectId(documentId))
    throw new apiError(400, 'Invalid or missing document id');

  const document = await Document.findById(documentId);

  if(!document) throw new apiError(400, "No such document present");

  const owner = await User.findById(document.owner).select('-password -refreshToken -__v');

  if(!owner) throw new apiError(500, "Something went wrong while fetching owner details");

  return res
    .status(200)
    .json(new apiResponse(200, owner, "Onwer details fetched successfully"))

});

export {
  createDocument,
  getUserDocuments,
  getDocumentByID,
  deleteDocument,
  getSharedDocuments,
  getAllDocuments,
  renameDocument,
  updateDocumentContent,
  getDocumentOwner
};
