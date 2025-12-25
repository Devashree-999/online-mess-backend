const express=require("express")
const{connection}=require("./config/db")
const {userRouter}=require("./routes/user.routes")
const router=require("./routes/mess.routes")
const cors=require("cors")
const path=require("path")

const app=express()
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "../frontend")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static("uploads"));

app.use("/user",userRouter)
app.use("/mess",router)

app.get("/",(req,res)=>{
    res.send({msg:"home page"})
})

app.listen(8080,async()=>{
    try {
        await connection
        console.log("Database connected");
        
    } catch (error) {
        console.log("unable to connect data",{error:error.message});
        
    }
    console.log("server is listening");
    
})