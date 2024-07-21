import mongoose, { Schema } from "mongoose";


const favouriteSchema = new Schema(
  {
    document: {
      type: mongoose.Types.ObjectId,
      ref: 'Document',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  }
)

const Favourite = mongoose.model('Favourite', favouriteSchema)

export { Favourite }