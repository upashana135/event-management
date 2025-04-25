require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRound = 10;
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const registerUser = async(req, res) => {
    const client = req.app.locals.redisClient;
    const newUser = req.body;
    const dbUser = {...newUser};
    const redisUser = await client.get(dbUser.email);
    if(redisUser){
        return res.status(409).json({error: "User alreday exist"});
    }
    try{
        dbUser.password = bcrypt.hashSync(newUser.password, saltRound);
        await client.set(dbUser.email, JSON.stringify(dbUser), {
            EX: 3600,
          });
        return res.status(200).json({message: "New User Created successfully!"});
    }catch(err){
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const loginUser = async(req, res) => {
    const client = req.app.locals.redisClient;
    const {email, password} = req.body;
    const redisUser = await client.get(email);
    if(!redisUser){
        return res.status(409).json({error: "User not found!"});
    }
    try{
        const user = JSON.parse(redisUser);
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if(!isValidPassword){
            return res.status(401).json({error: "Invalid Password"});
        }
        const token = jwt.sign({email: user.email, role: user.role}, SECRET_KEY, {expiresIn: "1h"});
        return res.status(200).json({message: "Logged In successfully!", token: token});
    }catch(err){
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {registerUser, loginUser};