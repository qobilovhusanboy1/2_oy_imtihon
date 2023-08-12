const adminRouter = require("./admin.route")
const servicesRouter = require("./services.route")
const fedbackROuter =require("./feedback_route")
const new_Users = require("./user_check");


module.exports = [
    adminRouter,
    servicesRouter,
    fedbackROuter,
    new_Users
]