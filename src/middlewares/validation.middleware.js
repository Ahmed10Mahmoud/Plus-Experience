
import Joi from 'joi'
export const isValid = (schema)=>{
    return(req,res,next)=>{
        console.log("is valid")
        const copyReq = {...req.body, ...req.params, ...req.query}
        const validateResult = schema.validate(copyReq,{abortEarly:false})
        if(validateResult.error){
            const messages = validateResult.error.details.map((error)=>error.message)
            return res.json({message:"failed validated ",messages})
        }
        console.log("valid")
        return next()
    }
}