const { json } = require("sequelize");
const AuthServices = require("../services/auth.services");
const transporter = require("../utils/mailer");

const register = async (req, res) => {
    try {
        const user = req.body;
        const result = await AuthServices.register(user);
        if (result) {
            res.status(201).json({message: "user created"});
            await transporter.sendMail({
                to: result.email,
                from: 'engriendonos@gmail.com',
                subject: 'email confirmation, Welcome',
                html: "<h2>Bienvenido al mi tienda virtual</h2> <p> tienes que confirmar tu email</p> <p> solo haz click en el siguiente <a href='#' target='new blank'> Enlace... </a></p>",
            });
        } else {
            res.status(400).json({message: "somethingn wrong"});
        }
    } catch (error) {
        res.status(400).json(error.message);        
    }; 
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                    error: "Missing Data",
                    message: "Not email or password provided"
            })
        }
        if (!password) {
            return res.status(400).json({
                error: "Missing Data",
                message: "Not email or password provided"
            })     
        }
        const result = await AuthServices.login({email, password});
        if (result.isValid) {
            const { username, id, email } = result.user;
            const userData = { username, id, email };
            const token = AuthServices.genToken(userData);
            result.user.token = token;
            res.json(result.user);
        } else {
            res.status(400).json({message: "user not found"})
        }
    }catch (error) {
        res.status(400).json({message: "something wrong"});        
    }
}

module.exports = {
    register,
    login
}