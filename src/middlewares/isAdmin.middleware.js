const Io = require("../utils/Io");
const jwt = require("../utils/jwt");

const Admins = new Io(process.cwd()+"/database/admin.database.json");

const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if(!token)
        return res.status(401).json({message: "Unauthorized"});

    const admins = await Admins.read();

    jwt.verify(token, (error, data) => {
        if(error) res.status(401).json({message: "Unauthorized"});
        
        //req.user = data
        //console.log(data);
        next()
    });
};

module.exports = isAdmin;