import path from 'path'
import express from 'express'
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import helmet from 'helmet';
import template from '../template';
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route'



const app = express();


// const CURRENT_WORKING_DIR = process.cwd()
// app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR,
// 'dist')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(compression())
app.use(cors())
app.use(helmet())

app.get('/',(req, res)=>{
    res.status(200).send(template())
})

app.use('/', userRoutes)
app.use('/', authRoutes)

app.use((err,req,res, next)=>{
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({'error': err.name + ':' + err.message})
    }else if(err){
        res.status(400).json({'error': err.name + ':' + err.message})
        console.log(err)
    }
})



export default app;