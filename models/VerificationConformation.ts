import { Schema, model, models, Document, Types } from 'mongoose';

interface IVerificationConfirmation extends Document {
  userId: Types.ObjectId;
}

const VerificationConfirmationSchema = new Schema<IVerificationConfirmation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const VerificationConfirmation = models.VerificationConfirmation || model<IVerificationConfirmation>('VerificationConfirmation', VerificationConfirmationSchema);
export default VerificationConfirmation;
