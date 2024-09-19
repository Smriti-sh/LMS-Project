const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    query: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, {
    timestamps: true,    //gives both created & updated time
});

module.exports = mongoose.model('Records', RecordSchema);
