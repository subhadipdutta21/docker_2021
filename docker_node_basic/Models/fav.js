const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema({
    id: String, // 'movie' | 'character'
    title: String,
    body: String
});

const Favorite = model('fav', favoriteSchema);

module.exports = Favorite;