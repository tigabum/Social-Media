import User from './../models/user.model'
import jwt from 'jsonwebtoken'
import config from './../../config/config'
import expressJwt from 'express-jwt'

const signin = async (req, res)=>{

    try{
        const user = await User.findOne({"email":req.body.email})
        if(!user){
            res.status('401').json({
                error: 'User Not Found!'
            })
        }

        if(!user.authenticate(req.body.password)){
            res.status('401').send({
                email:"Email and Password do not match."
            })
        }

        const token = jwt.sign({_id:user._id}, config.jwtSecret)

        res.cookie('t',token,{expire: new Date()+ 9999})

        return res.json({
            token,
            name:user.name,
            email:user.email,
            
        })
        
    }catch(err){
        return res.status('401').json({
            error:"Couldn't sign in."
        })
    }


}

const signout =(req, res)=>{
    res.clearCookie('t')
    return res.status('200').json({
        message:"signed out"
    })

}

const requireSignin = expressJwt({
    secret:config.jwtSecret,
    userProperty:'auth',
    algorithms: ['sha1', 'RS256', 'HS256'],
})

const hasAuthorization = (req,res, next)=>{
    let authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if(!(authorized)){
        return res.status('403').json({
            error:'User is not authorized'
        })
    }
    next()

}

export default {signin, signout,requireSignin, hasAuthorization}