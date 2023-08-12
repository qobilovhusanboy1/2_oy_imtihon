
const path = require('path');
const {v4:uuid} = require('uuid');

const Joi = require('joi');
const express = require('express');
const Io= require("../utils/Io")
const Feedback = new Io(process.cwd()+"/database/feedback.json")



const User =  require("../models/feedback");



const create = async(req, res) =>{


    const {name,job,text} = req.body

    const schema = Joi.object({
        name: Joi.string().required(),
        job: Joi.string().required(),
        text: Joi.string().required(),
    });
      
    const {error} = schema.validate({
        name,
        job,
        text
    });
      
    if (error) return res.status(400).json({message: error.message});


    const image = req.files?.photo;
    const mimetype = path.extname(image.name);
    const photo = uuid() + mimetype;
    
    image.mv(process.cwd()+"/uploads/"+photo)
    console.log(image);

    const feedback_user = await Feedback.read()
    const id = (feedback_user[feedback_user.length - 1]?.id || 0) + 1;

    const newUser =  new User(id,name,job,text,image)
    const data = feedback_user.length ? [...feedback_user, newUser] : [newUser];

    await Feedback.write(data);
    return res.status(201).json({message:"added Feedback"});

}

const get_all = async(req,res)=>{
    const feedback_user = await Feedback.read()
    return res.status(200).json(feedback_user);
}

const deleted = async(req,res)=>{
    const {id} = req.params;

    const schema = Joi.object({
        id: Joi.number().required(),
    });
      
    const {error} = schema.validate({
        id,
    });
      
    if (error) return res.status(400).json({message: error.message});


    const feedback_user = await Feedback.read()

    const data = feedback_user.filter(user => user.id!= id);

    await Feedback.write(data);

    return res.status(200).json({message:"deleted Feedback"});
}

const update = async(req,res)=>{
    const {id} = req.params;

    const {name,job,text} = req.body

    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        job: Joi.string().required(),
        text: Joi.string().required(),
    });
      
    const {error} = schema.validate({
        id,
        name,
        job,
        text
    });
      
    if (error) return res.status(400).json({message: error.message});

    const feedback_user = await Feedback.read()

    const data =[] 

    for(let i=0;i<feedback_user.length;i++){
        if(feedback_user[i].id == id){
            feedback_user[i].name = name
            feedback_user[i].job = job
            feedback_user[i].text = text
        }
        data.push(feedback_user[i])
    }

    await Feedback.write(data);

    return res.status(200).json({message:"updated Feedback"});
}


module.exports = {
    create,
    get_all,
    deleted,
    update
}