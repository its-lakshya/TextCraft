import mongoose, { Schema } from 'mongoose';

const documentSchema = new Schema({
  documentName: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  access: {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    accessType: {
      type: String,
      enum: ["read", "write"],
      default: "read",
    }
  },
}, {timestamps: true})


const Document =  mongoose.model("Document", documentSchema)

export { Document }
