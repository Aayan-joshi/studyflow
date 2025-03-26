import {Schema, Types, model, models} from "mongoose"

export interface IVote {
    user: Types.ObjectId
    itemId: Types.ObjectId
    voteType: "upvote" | "downvote"
    itemType: "question" | "answer"
    createdAt: Date
}

const VoteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    itemType: {
        type: String,
        enum: ["question", "answer"],
        required: true
    },
    voteType: {
        type: String,
        enum: ["upvote", "downvote"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

},
{
    timestamps: true
})

export interface IVoteDoc extends IVote, Document {}
const Vote = models.Vote || model<IVote>("Vote", VoteSchema)
export default Vote