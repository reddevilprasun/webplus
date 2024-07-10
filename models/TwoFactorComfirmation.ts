import { Schema, model, models, Document, Types } from 'mongoose';

interface ITwoFactorConfirmation extends Document {
  id: string;
  userId: Types.ObjectId;
}

const twoFactorConfirmationSchema = new Schema<ITwoFactorConfirmation>({
  id: {
    type: String,
    default: () => new Types.ObjectId().toString(),
  },
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

const TwoFactorConfirmation = models.TwoFactorConfirmation || model<ITwoFactorConfirmation>('TwoFactorConfirmation', twoFactorConfirmationSchema);
export default TwoFactorConfirmation;
