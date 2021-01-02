const mongoose=require('mongoose')
const connectDB= async()=>{
try {
    const conn =await mongoose.connect(process.env.MONGO_URI,{
useNewUrlParser:true,       //this remove warning from console
useUnifiedTopology:true,    //this remove warning from console
useFindAndModify:false         //this remove warning from console

    })
     console.log(`mongo connnected ${conn.connection.host}`);
    
} catch (error) {
    console.error(error)
process.exit(1)     // exit with failure that's why we put 1

}

}
module.exports=connectDB