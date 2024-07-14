import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Document } from '../models/document.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

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

  return res.status(200).json(new apiResponse(200, 'Document created successfully'));
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

  if (!document) {
    throw new apiError(500, 'Something went wrong while fetching the document');
  }

  return res.status(200).json(new apiResponse(200, document, 'Document fetched successfully'));
});

const updateDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  const { documentName, content } = req.body;

  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing document id');
  }

  if (!documentName && !content) {
    throw new apiError(400, 'Atleast one from the documentName or content is required');
  }

  const fieldsToBeUpdated = {};

  if (documentName && documentName.trim() !== '') {
    fieldsToBeUpdated.documentName = documentName;
  }

  if (content && content.trim() !== '') {
    fieldsToBeUpdated.content = content;
  }

  const document = await Document.findByIdAndUpdate(documentId, fieldsToBeUpdated, { new: true });

  if (!document) {
    throw new apiError(500, 'Something went wrong while updating the document');
  }

  return res.status(200).json(new apiResponse(200, document, 'Document updated successfully'));
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

  const document = await Document.findByIdAndDelete(documentId);

  if (!document) {
    throw new apiError(500, 'Something went wrong while deleting the document');
  }

  return res.status(200).json(new apiResponse(200, 'Document deleted successfully'));
});

const addCollaborator = asyncHandler(async (req, res) => {
  const user = req.user;
  const { documentId } = req.params;
  const { email, accessType } = req.body;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing document id');
  }

  if(!email){
    throw new apiError(400, "Email is missing");
  }

  if(accessType !== 'read' && accessType !== 'write' && accessType){
    throw new apiError(400, "Invalid accessType")
  }

  const document = await Document.findById(documentId);

  if (!document) {
    throw new apiError(500, 'Something went wrong while deleting the document');
  }

  const collaborator = await User.findOne({email});

  if(!collaborator){
    throw new apiError(404, "No such user with this email found");
  }

  document.collaborators.push({user: collaborator, accessType: accessType || 'read'})

  const addedCollaborator = await document.save();

  if(!addedCollaborator){
    throw new apiError(500, "Something went wrong while adding the collaborator")
  }

  return res
    .status(200)
    .json(new apiResponse(200, "Collaborator added successfully"));
});

const removeCollaborator = asyncHandler(async (req, res) => {});

const updateCollaboratorPermissions = asyncHandler(async (req, res) => {});

export {
  createDocument,
  getAllDocuments,
  getDocumentByID,
  updateDocument,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorPermissions,
};
