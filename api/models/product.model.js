const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    pdfBuffer: {
        type: Buffer,
        required: true
    },
    pdfPath: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    totalPages:{
        type: Number,
        required: true
    }
}, {
    timestamps: true,    //gives both created & updated time
});

module.exports = mongoose.model('Product', ProductSchema);