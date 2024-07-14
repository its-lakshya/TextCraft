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

const getAllDocument = asyncHandler(async (req, res) => {});

const getDocumentByID = asyncHandler(async (req, res) => {});

const updateDocument = asyncHandler(async (req, res) => {});

const deleteDocument = asyncHandler(async (req, res) => {
  
});

const addCollaborator = asyncHandler(async (req, res) => {});

const removeCollaborator = asyncHandler(async (req, res) => {});

const updateCollaboratorPermissions = asyncHandler(async (req, res) => {});

export {
  createDocument,
  getAllDocument,
  getDocumentByID,
  updateDocument,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorPermissions,
};
