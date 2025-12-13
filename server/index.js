import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({path:"./.env"});


const port=process.env.PORT  || 5000 ;

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
})
.catch((error)=>{
    console.log("Failed to connect to database",error);
});
;



