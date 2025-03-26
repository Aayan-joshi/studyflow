import { Schema, model, models, Types } from "mongoose"

export interface IAnswer {
    question: Types.ObjectId
    content: string
    author: Types.ObjectId
    upvotes: number
    downvotes: number
    createdAt: Date
}

const answerSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 5000
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

},
{
    timestamps: true
})

export interface IAnswerDoc extends IAnswer, Document {}
const Answers = models.Answer || model<IAnswer>("Answer", answerSchema) 
export default Answers