import { Schema, model, models, Types, Document } from "mongoose";

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  number : string;
  numberVerified?: Date;
  image?: string;
  password: string;
  role: UserRole;
  accounts: Types.ObjectId[];
  isTwoFactorEnabled: boolean;
  twoFactorConfirmation?: Types.ObjectId;
} 

const userSchema = new Schema<IUser>({
  id: {
    type: String,
    default: () => new Types.ObjectId().toString(),
  },
  firstName: String,
  lastName: String,
  number: {
    type: String,
    unique: true,
    required: true,
  },
  numberVerified: Date,
  image: String,
  password: String,
  role: {
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  },
  accounts: [{
    type: Schema.Types.ObjectId,
    ref: 'Account',
  }],
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorConfirmation: {
    type: Schema.Types.ObjectId,
    ref: 'TwoFactorConfirmation',
  },
});

const User = models.User || model<IUser>('User', userSchema);
export default User;