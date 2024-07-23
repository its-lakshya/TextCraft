import mongoose, { Schema } from 'mongoose';

const collaborationSchema = new Schema(
  {
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    isPublic: {
      type: Boolean,
      defaut: false,
    },
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    accessType: {
      type: String,
      enum: ['read', 'write'],
      default: 'read',
    },
  },
  { timestamps: true },
);

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

export { Collaboration };
