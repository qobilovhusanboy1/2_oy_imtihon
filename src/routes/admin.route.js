const {Router} = require("express");
const { admin } = require("../controllers/admin.controller");

const router = Router();

router.post("/newAdmin", admin);

module.exports = router;