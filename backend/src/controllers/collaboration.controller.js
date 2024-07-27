import mongoose, { mongo } from 'mongoose';
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

  const collaborators = await Collaboration.find({ document }).populate('collaborator');

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

const toggleIsPublic = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { isPublic } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid or missing documentId');
  }

  const document = await Document.findById(documentId);

  if(!(document.owner).equals(user._id)){
    throw new apiError(405, "User is unauthorized to set public status this document")
  }

  if (isPublic === true) {
    const alreadyPublic = await Collaboration.findOne({ document, isPublic: true });
    if (alreadyPublic) {
      throw new apiError(400, 'Document is already public');
    }

    const publicDocument = await Collaboration.create({ document, isPublic });

    if (!publicDocument) {
      throw new apiError(500, 'Something went wrong while setting document to public');
    }
    return res
      .status(200)
      .json(new apiResponse(200, 'Access Status is set to public successfully'));
  }

  const deletePublic = await Collaboration.findOneAndDelete({ document, isPublic: true });
  if (!deletePublic) {
    throw new apiError(400, 'Document is already private');
  }

  return res
    .status(200)
    .json(new apiResponse(200, 'Doument is successfuly removed from public access'));
});

const setPublicAccessType = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { publicAccessType } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if(!mongoose.isValidObjectId(documentId)){
    throw new apiError(400, "Either invalid of missing document id");
  }

  if(!publicAccessType || publicAccessType.trim() === '' || publicAccessType !== 'read' || publicAccessType !== 'write'){
    throw new apiError(300, "A valid pubic access types is required")
  }

  const document = await Document.findById(documentId);
  if(!(document.owner).equals(user._id)){
    throw new apiError(402, "User is unauthorized to rename this document")
  }

  const collaboration = await Collaboration.findOneAndUpdate({documentId, isPublic: true, publicAccessType})

  if(!collaboration){
    throw new apiError(401, "Document is private, private documents can you set public access types")
  }

  return res
    .status(200)
    .json(new apiResponse(200, "Public access type of the document is set successfully"))

});

const getPublicAccessInformation = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if(!mongoose.isValidObjectId(documentId)){
    throw new apiError(400, "Either invalid of missing document id");
  }

  console.log(documentId)
  const document = await Document.findById(documentId)
  const collaboration = await Collaboration.find({document, isPublic: true})

  if(!collaboration){
    throw new apiError(500, 'Something went wrong while fetching public access information of the document')
  }
  
  if(collaboration.length === 0){
    throw new apiError(405, 'Document is private')
  }

  return res
    .status(200)
    .json(new apiResponse(200, collaboration));

});

export {
  addCollaborator,
  removeCollaborator,
  updateAccessTypes,
  getAllCollaborators,
  getCollaboratorsAccessType,
  toggleIsPublic,
  setPublicAccessType,
  getPublicAccessInformation
};
