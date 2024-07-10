import { Schema, model, models, Document, Types } from 'mongoose';

interface ITwoFactorToken extends Document {
  id: string;
  number: string;
  token: string;
  expires: Date;
}

const twoFactorTokenSchema = new Schema<ITwoFactorToken>({
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

const TwoFactorToken = models.TwoFactorToken || model<ITwoFactorToken>('TwoFactorToken', twoFactorTokenSchema);
export default TwoFactorToken;
