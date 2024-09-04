const mongoose=require('mongoose')
require('dotenv').config()

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected")
}

module.exports=main
