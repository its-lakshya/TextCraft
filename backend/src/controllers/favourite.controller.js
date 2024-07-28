import mongoose, { mongo } from 'mongoose';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Favourite } from '../models/favourite.model.js';
import { Document } from '../models/document.model.js';
import { User } from '../models/user.model.js';

const toggleFavourite = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const user = req.user;
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
      .status(200)
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

const getFavourieDocuments = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  // const favouriteDocuments = await Favourite.find({ user });

  const favouriteDocuments = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $project: {
        _id:1
      }
    },
    {
      $lookup: {
        from: 'favourites',
        localField: '_id',
        foreignField: 'user',
        as: 'fav',
        pipeline: [
          {
            $lookup: {
              from: 'documents',
              localField: 'document',
              foreignField: '_id',
              as: 'documents'
            }
          },
          {
            $unwind: '$documents'
          },
          {
            $replaceRoot: {newRoot: '$documents'}
          }
        ]
      }
    },
    {
      $unwind: '$fav'
    },
    {
      $replaceRoot: {newRoot: '$fav'}
    }
  ]);

  if (!favouriteDocuments) {
    throw new apiError(500, 'Something went wrong while fething favourite documents');
  }

  return res
    .status(200)
    .json(new apiResponse(200, favouriteDocuments, 'Favourite documents fetched successfully'));
});

export { toggleFavourite, getFavourieDocuments };
