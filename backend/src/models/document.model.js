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
  }
}, {timestamps: true})


const Document =  mongoose.model("Document", documentSchema)

export { Document }
