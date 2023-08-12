
const {Router} = require("express");

const {create ,get_all,deleted,update} = require("../controllers/fedback_controller");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = Router();

router.post("/feedback/create",  isAdmin,create);
router.get("/feedback/getall", get_all);
router.delete("/feedback/delete/:id",isAdmin,deleted)
router.put("/feedback/update/:id", isAdmin,update);





module.exports = router;
