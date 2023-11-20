import express from 'express'
import { dbConnection } from './db.js'
import cors from "cors"
import bodyParser from 'body-parser'
import { ListModel } from './ListModel.js'
import dotenv from 'dotenv'
import { generarCombinacionAleatoria } from './functions.js'

const app = express()
const PORT = 5174

app.use(bodyParser.json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'listid'],
}))

dotenv.config()

dbConnection().then(async function onServerInit() {
    console.log("DB connected")

    app.listen(PORT, () => {
        console.log(`Serving on PORT ${PORT}`)
    })
})

app.get('/ping', (req, res) => {
    res.send('Pong!')
})

app.get("/getPublicList", async (req, res) => {
    const { listid } = req.headers
    const list = await ListModel.findOne({ listId: listid })
    if (!list) {
        return res.status(404).json({
            ok: false,
            msg: 'There is no list with this id.'
        })
    } else {
        return res.status(200).json({
            ok: true,
            list
        })
    }
})

app.post("/addToList", async (req, res) => {
    const { listid, listitem } = req.body.data
    const list = await ListModel.findOne({ listId: listid })
    if (!list) {
        return res.status(404).json({
            ok: false,
            msg: 'There is no list with this id.'
        })
    } else {
        list.items.push(listitem)
        await list.save()
        return res.status(200).json({
            ok: true,
            msg: "List updated."
        })
    }
})

app.delete("/deleteFromList", async (req, res) => {
    const { listid, listitemid } = req.body
    const list = await ListModel.findOne({ listId: listid })
    if (!list) {
        return res.status(404).json({
            ok: false,
            msg: 'There is no list with this id.'
        })
    } else {
        list.items = list.items.filter(item => item.id !== listitemid)
        await list.save()
        return res.status(200).json({
            ok: true,
            msg: "List updated."
        })
    }
})

app.post("/fromLocalToPublicList", async (req, res) => {

    const { listItems } = req.body.data
    const newListId = generarCombinacionAleatoria()
    const newList = new ListModel({
        listId: newListId,
        items: listItems
    })
    await newList.save()
    return res.status(200).json({
        ok: true,
        msg: "List is public.",
        newListId
    })
})

app.get("/deletePublicList", async (req, res) => {
    const { listId } = req.body
    const list = await ListModel.findOne({ listId })
    if (!list) {
        return res.status(404).json({
            ok: false,
            msg: 'There is no list with this id.'
        })
    } else {
        await list.remove()
        return res.status(200).json({
            ok: true,
            msg: "List deleted."
        })
    }
})

app.post("/changeCompletedTask", async (req, res) => {
    const { listid, listitemid, completedBoolean } = req.body.data
    .log(listid, listitemid, completedBoolean)
    try {
        const list = await ListModel.findOne({ listId: listid })

        if (!list) {
            return res.status(404).json({
                ok: false,
                msg: 'There is no list with this id.'
            })
        }

        list.items = list.items.map((item) =>
            item.id === listitemid ? { ...item, completed: completedBoolean } : item
        )

        list.items = list.items.sort((a, b) => {
            if (a.completed && !b.completed) return 1
            if (!a.completed && b.completed) return -1
            return 0
        })
        await list.save()
        return res.status(200).json({
            ok: true,
            msg: "List updated."
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok: false,
            msg: "Internal Server Error."
        })
    }
})