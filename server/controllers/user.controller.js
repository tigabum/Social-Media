import databaseErrorHandle from './../helpers/dbErrorHandler'
import User from './../models/user.model'
import extend from 'lodash/extend'
import dbErrorHandler from './../helpers/dbErrorHandler'
const create = async (req, res) => {
    let user = new User(req.body)

        try{
            await user.save();
           return res.status('200').json({
                message:"User successfully signed"
            })

        }catch(err){
            return res.status('400').json({
                error: databaseErrorHandle.getErrorMessage(err)
            })

        }

}

const list = async (req, res) => {
                   try{
                       let users = await User.find().select('name email created updated')
                      return res.json(users)

                   }catch(err){
                         return res.status('400').json({
                            error: databaseErrorHandle.getErrorMessage(err)
                        })
                   }


}

const userById = async (req, res, next, id)=>{
                try{
                    let user = await User.findById(id)
                        if(!user){
                           return  res.status('400').json({
                                error:'user could not found'
                            })
                        }
                        req.profile = user
                        next();

                }catch(err){
                   return res.status('400').json({
                        error:'Could not retrive user'
                    })

                }

}

const read = (req, res)=>{

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile)

}

const update = async (req, res)=>{

    try{
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json(user)

    }catch(err){
        return res.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        })

    }

}

const remove = async (req, res) => {
   try{
     let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
     res.json(deletedUser)

   }catch(err){
       return res.status('400').json({
           error:dbErrorHandler.getErrorMessage(err)
       })

   }

}


export default {create, list, update, remove,read,userById}