const Router = require("express").Router();
const {Signin, Signup} = require("../controllers");

Router.post("/signup", Signup);
Router.post("/signin", Signin);

module.exports = Router;
