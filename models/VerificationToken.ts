import { Schema, model, models, Document, Types } from 'mongoose';

interface IVerificationToken extends Document {
  id: string;
  number: string;
  token: string;
  expires: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  id: {
    type: String,
    default: () => new Types.ObjectId().toString(),
  },
  number: String,
  token: {
    type: String,
    unique: true,
  },
  expires: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const VerificationToken = models.VerificationToken || model<IVerificationToken>('VerificationToken', verificationTokenSchema);
export default VerificationToken;
