import {Schema, model, models, Types} from "mongoose"

export interface ICollection {
    author: Types.ObjectId
    question: Types.ObjectId
}

const CollectionSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    }
},
{
    timestamps: true
})

export interface ICollectionDoc extends ICollection, Document {}
const Collection = models.Collection || model<ICollection>("Collection", CollectionSchema)
export default Collection