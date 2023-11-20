import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
    title: String,
    id: String,
    completed: {
        type: Boolean,
        default: false
    }
}, { _id: false })

const ListSchema = new mongoose.Schema({
    listId: String,
    items: [ItemSchema]
},
    { versionKey: false })

export const ListModel = mongoose.model("List", ListSchema, "Lists")
