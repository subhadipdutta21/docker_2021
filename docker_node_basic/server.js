const express = require('express')
const axios = require('axios')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Favorite = require('./Models/fav')

const app = express()
app.use(bodyParser.json());

const dummyData = [
    {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
        "userId": 1,
        "id": 2,
        "title": "qui est esse",
        "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    },
    {
        "userId": 1,
        "id": 3,
        "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
    },
]

app.get('/users', (req, res) => {
    res.send(dummyData).status(200)
})

app.get('/dummyposts', (req, res) => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(json => {
            res.status(200).json({ data: json.data })
        })
        .catch(err => console.log(err))
})

app.get('/myfavs', (req, res) => {
    Favorite.find()
        .then(resp => {
            console.log(resp)
            res.status(200).json({ data: resp })
        })
        .catch(err => console.log(err))
})

app.post('/fav', async (req, res) => {
    let { post_id } = req.body
    let resp = await Favorite.find({ id: post_id })

    if (resp.length > 0)
        res.json({ message: 'already added to fav' })

    else {
        axios.get(`https://jsonplaceholder.typicode.com/posts/${post_id}`)
            .then(async resp => {                
                let { id, title, body } = resp.data
                const fav = new Favorite({ id, title, body })
                try {
                    await fav.save()
                    res.status(200).json({ message: 'favourite added!' })

                } catch (error) { console.log(error) }
            })
            .catch(err => console.log(err))
    }
})


// mongodb://localhost:27017/docker_node_basic
// change localhost into => host.docker.internal
// mongo image docker 172.17.0.2

mongoose.connect('mongodb://mongodb:27017/docker_node_basic', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log('DB error', err);
    else {
        console.log('DB connected!')
        app.listen(3000, () => console.log('server running on port 3000'))
    }
})


