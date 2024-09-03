const { strict } = require("assert");
const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const ProductSchema = mongoose.Schema(
    {
        num:{
            type:Number,
            required:true,
            default:0
        },
        name:{
            type:String,
            required: [type,"Please enter book's name"],
        },
        author:{
            type:String,
            required: [type,"Please enter author's name"],
        },
        pages:{
            type:Number,
            // required: true,
            default:0
        },
        pdfLink:{
            type:String,
            required:false,
        },
    },
    {
        timestamps:true,    //gives both created & updated time
    }
);

const Product = mongoose.model("Product", ProductSchema);   //mongo itself adds 's' & lowercase to the collection name

module.exports = Product;