const {Router} = require("express");
const {user_login,user_view_on,user_view_all } = require("../controllers/user_checks");
const isAdmin =  require("../middlewares/isAdmin.middleware")

const router = Router();

router.post("/contact", user_login);
router.get("/new_view_on/:id", isAdmin,user_view_on);
router.get("/new_view_all",isAdmin, user_view_all);

module.exports = router;