const path = require("path");
const { v4: uuid } = require("uuid")


const Joi = require("joi");
const Io = require('../utils/Io');
const Service = require("../models/services.model");

const Services = new Io(process.cwd()+"/database/service.database.json")

const create = async (req, res) => {
    const {name, about} = req.body;
    const image = req.files?.photo;

    const schema = Joi.object({
        name: Joi.string().required(),
        about: Joi.string().required(),
    });
      
    const {error} = schema.validate({
        name,
        about,
    });
      
    if (error) return res.status(400).json({message: error.message});

    const mimetype = path.extname(image.name);
    const photo = uuid() + mimetype;

    image.mv(process.cwd() + "/uploads/" + photo);

    const services = await Services.read();

    const id = (services[services.length - 1]?.id || 0) + 1;

    const newService = new Service(id, name, about, photo);

    const data = services.length ? [...services, newService] : [newService];

    await Services.write(data);

    res.status(201).json({message: "Created"});
}

const get_services = async (req, res) => {
    try {
        const services = await Services.read();

        res.json({services: services})
    } catch (error) {
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}

const get_one_service = async (req, res) => {
    try {
        const {id} = req.params;
        const schema = Joi.object({
            id: Joi.number().required()
        });
          
        const {error} = schema.validate({
            id,
        });
          
        if (error) return res.status(400).json({message: error.message});

        const services = await Services.read();

        const service = services.find((service) => service.id == id);

        if(!service) return res.status(404).json({message: "SERVICE NOT FOUND"});

        res.status(201).json({service: service})
    } catch (error) {
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}

const remove_one_service = async (req, res) => {
    try {
        const {id} = req.params;
        const schema = Joi.object({
            id: Joi.number().required()
        });
          
        const {error} = schema.validate({
            id,
        });
          
        if (error) return res.status(400).json({message: error.message});
        const services = await Services.read();

        const service = services.filter((service) => service.id != id);

        await Services.write(service);

        res.status(201).json({message: "Success"});
    } catch (error) {
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}



const update_one_service = async (req, res) => {
    const {id} = req.params;
    const {name, about} = req.body;
    const image = req.files?.photo;

    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        about: Joi.string().required(),
    });
      
    const {error} = schema.validate({
        id,
        name,
        about
    });
      
    if (error) return res.status(400).json({message: error.message});

    const services = await Services.read();

    const service = services.find((service) => service.id == id);

    if(!service)
        return res.status(404).json({message: "SERVICE NOT FOUND"});

    if(image) {
        const mimetype = path.extname(image.name);
        const photo = uuid() + mimetype;

        image.mv(process.cwd() + "/uploads/" + photo);
    }

    service.name = name ? name : service.name;
    service.about = about ? about : service.about;

    await Services.write(services);

    res.json({message: "Success", data: services});
}

module.exports = { create, get_services, get_one_service, remove_one_service , update_one_service};