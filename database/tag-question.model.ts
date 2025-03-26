import {model, models, Schema, Types} from "mongoose"

export interface ITagQuestion {
    question: Types.ObjectId
    tag: Types.ObjectId
}

const TagQuestionSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    tag: {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true
    }
},
{
    timestamps: true
})
 
export interface ITagQuestionDoc extends ITagQuestion, Document {}
const TagQuestion = models.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema)
export default TagQuestion