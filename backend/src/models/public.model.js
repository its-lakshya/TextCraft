import mongoose, { Schema } from 'mongoose';

const publicSchema = new Schema(
  {
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    accessType: {
      type: String,
      enum: ['read', 'write'],
      default: 'read',
    },
  },
  { timestamps: true },
);

const Public = mongoose.model('Public', publicSchema);

export { Public };
