import mongoose, { mongo } from 'mongoose';
import { apiError } from '../utils/apiError';
import { apiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { Favourite } from '../models/favourite.model';
import { Document } from '../models/document.model';

const toggleFavourite = asyncHandler(async (req, res) => {
  const user = req.user;
  const documentId = req.params;
  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!mongoose.isValidObjectId(documentId)) {
    throw new apiError(400, 'Invalid of missing document id');
  }

  const document = await Document.findById(documentId);

  if (!document) {
    throw new apiError(400, 'No such document found');
  }

  const alreadyFavoutite = await Favourite.findOne({ document, user });

  if (alreadyFavoutite) {
    await Favourite.findOneAndDelete({ document, user });
    return res
      .statsu(200)
      .json(new apiResponse(200, 'Document remove from favourite successfully'));
  } else {
    const favourite = await Favourite.create({
      document,
      user,
    });

    if (!favourite) {
      throw new apiError(500, 'Something went wrong while adding the document to favourites');
    }

    return res.status(200).json(new apiResponse(200, 'Document added to favourite successfully'));
  }
});

export { toggleFavourite };
