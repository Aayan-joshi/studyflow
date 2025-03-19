import { Schema, model, models  } from "mongoose"

export interface ITag {
    name: string
    questions: number
}

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 150
    },
    questions: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
})


const Tag = models.tag || model<ITag>("Tag", tagSchema) 
export default Tag