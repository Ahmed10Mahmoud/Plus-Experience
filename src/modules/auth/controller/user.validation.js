import Joi from 'joi';

export const registerSchema = Joi.object({
    userName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/) // at least one digit in any position
        .regex(/[0-9a-zA-Z]*[a-zA-Z][0-9a-zA-Z]*/) // at least one letter in any position
        .min(4)
        .required(), 
    role:Joi.string().required()
}).required();

export const activateSchema = Joi.object({
    activationCode: Joi.string().required()
}).required();


export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        //.regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/) // at least one digit in any position
        //.regex(/[0-9a-zA-Z]*[a-zA-Z][0-9a-zA-Z]*/) // at least one letter in any position
        .min(4)
        .required(),  // Added .required() here

}).required()
