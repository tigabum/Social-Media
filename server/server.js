import app from "./express";
import config from './../config/config';
import mongoose from 'mongoose'

app.listen(config.port,(err)=>{
    if(err){
        console.log("Error from server", err)
    }
    console.log("Server is started on the port", config.port);
} )

mongoose.Promise = global.Promise

mongoose.connect(config.mongoUri, {useNewUrlParser:true,
                                    useCreateIndex:true,
                                    useUnifiedTopology:true
                                    } )
mongoose.connection.on('error',()=>{
    throw new Error(`unable to connect to database: ${mongoUri}`)
} )