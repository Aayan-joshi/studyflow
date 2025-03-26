import {Schema, Types, model, models} from 'mongoose'

export interface IAccount {
    user: Types.ObjectId;
    name: string;
    image: string;
    password: string;
    provider: string;
    providerUUID: string;
}

const accountSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, required: true},
    image: {type: String},
    password: {type: String},
    provider: {type: String, required: true},
    providerUUID: {type: String, required: true}
},
{
    timestamps: true
}
)

export interface IAccountDoc extends IAccount, Document {}
const Account = models?.Account || model<IAccount>('Account', accountSchema)
export default Account