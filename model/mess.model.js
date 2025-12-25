const mongoose=require("mongoose")

const messSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    about:{type:String,required:true},
    year:{type:String,required:true},
    owner:{type:String,required:true},
    address:{type:String,required:true},
    state:{type:String,required:true},
    city:{type:String,required:true},
    area:{type:String,required:true},
    image:{type:String,required:true},
    users: { type: Number, default: 0 },
    subscribers: [{ type: String }]
})

const MessModel=mongoose.model("mess",messSchema)

module.exports={MessModel}