const express=require('express')
const app=express()
require('dotenv').config()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
const cors=require('cors')
app.use(cors())

app.use('/uploads',express.static('uploads'))
const userRouter=require('./router/userrouter')
app.use('/',userRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})