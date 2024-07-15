import { Schema, model, models, Types, Document } from 'mongoose';

interface IAccount extends Document {
  id: string;
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

const accountSchema = new Schema<IAccount>({
  id: {
    type: String,
    default: () => new Types.ObjectId().toString(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: String,
  provider: String,
  providerAccountId: {
    type: String,
    unique: true,
  },
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Account = models.Account || model<IAccount>('Account', accountSchema);
export default Account;
