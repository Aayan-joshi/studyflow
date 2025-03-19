import { Schema, model, models, Types } from "mongoose"

export interface IQuestion {
    title: string
    content: string
    tags: Types.ObjectId[]
    author: Types.ObjectId
    views: number
    answers: number
    votes: number
    createdAt: Date
}

const questionSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 150
    },
    content: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 5000
    },
    tags: {
        type: [{type: Schema.Types.ObjectId, ref: "Tag"}],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    answers: {
        type: Number,
        default: 0
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

export interface IQuestionDoc extends IQuestion, Document {}
const Questions = models.Question || model<IQuestion>("Question", questionSchema) 
export default Questions