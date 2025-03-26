import { Schema, model, models, Document } from 'mongoose';

export interface IUser {
    name: string;
    username: string;
    email: string;
    bio?: string;
    image: string;
    Location?: string;
    portfolio?: string;
    reputation?: number;
}

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        bio: { type: String },
        image: { type: String, required: true },
        Location: { type: String },
        portfolio: { type: String },
        reputation: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export interface IUserDoc extends IUser, Document {}
const User = models.User || model<IUserDoc>('User', userSchema); // Use models.User (uppercase)
export default User;




