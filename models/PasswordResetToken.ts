import { Schema, model, models, Document, Types } from 'mongoose';

interface IPasswordResetToken extends Document {
  id: string;
  number: string;
  token: string;
  expires: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>({
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

const PasswordResetToken = models.PasswordResetToken || model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);
export default PasswordResetToken;
