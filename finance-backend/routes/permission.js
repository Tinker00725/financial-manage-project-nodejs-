const router = require("koa-router")();
const {createUser} = require("../controllers/user");

router.prefix("/permission")
.post("/createUser", createUser);

module.exports = router;
