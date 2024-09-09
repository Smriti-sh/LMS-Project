const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

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

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', ProductSchema);