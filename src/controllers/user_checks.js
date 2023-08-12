
const Joi =require('joi');

const Io= require("../utils/Io")
const Check = new Io(process.cwd()+"/database/view.json")

const view_login = require("../models/user")

const user_login = async(req,res)=>{
    const {name,email,phonenumber,message} = req.body

    const phoneNumberRegex =/^\+998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;

    const schema = Joi.object({
        name: Joi.string().required(),
        phonenumber: Joi.string().regex(phoneNumberRegex).required(),
        email: Joi.string().required(),
        message: Joi.string().required(),
    });
      
    const {error} = schema.validate({
        name,
        phonenumber,
        email,
        message,
    });
      
    if (error) return res.status(400).json({message: error.message});
    
    
    
    const users = await Check.read();
    const id = (users[users.length - 1]?.id || 0) + 1;

    const newUser = new view_login(id,name,phonenumber,email,message)

    const data = users.length ? [...users, newUser] : [newUser];

    await Check.write(data);
    return res.status(201).json({message:"add user successfully"});
}


const user_view_on =async(req,res)=>{
    const {id} =req.params
    const schema = Joi.object({
        id: Joi.number().required(),
    });
      
    const {error} = schema.validate({
        id,
    });
      
    if (error) return res.status(400).json({message: error.message});

    const users= await Check.read();

    const finduser = users.find((u) => u.id ==  id)

    if (!finduser) return res.status(404).json({message:"no found user"});

    if (finduser.view == "+") return res.status(401).json({message:"user already seen"})
    else finduser.view="+"

    await Check.write(users)

    return res.status(401).json({message:"see user"})

}


const user_view_all =async(req,res)=>{

    const users= await Check.read();

    let finduser=[]
    for(let i=0; i<users.length; i++){
        if(users[i].view=="-") users[i].view="+"
        else users[i].view="+"
        finduser.push(users[i])
        
    }
    // console.log(finduser);

    await Check.write(finduser)

    return res.status(401).json({message:"seen all user"})

}





module.exports = {user_login,user_view_on,user_view_all}

