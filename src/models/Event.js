const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    thumbnail: String,
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    toJSON: {
        virtuals: true
    }
});

// store thumbnail url as virtual property. this keyword refers to the original object we are accessing which is EventSchema
// Arrow function can't access with this keyword
EventSchema.virtual("thumbnail_url").get(function () { return this.thumbnail })

module.exports = mongoose.model('Event', EventSchema)