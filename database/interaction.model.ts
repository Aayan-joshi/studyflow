import {Schema, model, models, Types} from "mongoose"

export interface IInteraction {
    user: Types.ObjectId
    itemType: "question" | "answer"
    action: "view" | "upvote" | "downvote"
    itemId: Types.ObjectId
    createdAt: Date
}

const InteractionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    itemType: {
        type: String,
        enum: ["question", "answer"],
        required: true
    },
    action: {
        type: String,
        enum: ["view", "upvote", "downvote"],
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
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

export interface IInteractionDoc extends IInteraction, Document {}
const Interaction = models.interaction || model<IInteraction>("Interaction", InteractionSchema)
export default Interaction