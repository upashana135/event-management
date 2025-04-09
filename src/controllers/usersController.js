require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRound = 10;
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const registerUser = async(req, res) => {
    const users = req.app.locals.users;
    const newUser = req.body;
    const dbUser = {...newUser};
    dbUser.password = bcrypt.hashSync(newUser.password, saltRound);
    const existingUser = await users.find((user) => user.email === dbUser.email );
    if(existingUser){
        return res.status(409).json({error: "User alreday exist"});
    }
    await users.push(dbUser);
    return res.status(200).json({message: "New User Created successfully!"});
}

const loginUser = async(req, res) => {
    const users = req.app.locals.users;
    const {email, password} = req.body;
    const existingUser = await users.find((user) => user.email === email );
    if(!existingUser){
        return res.status(409).json({error: "User not found!"});
    }
    const isValidPassword = bcrypt.compareSync(password, existingUser.password);
    if(!isValidPassword){
        return res.status(401).json({error: "Invalid Password"});
    }
    const token = jwt.sign({email: existingUser.email, role: existingUser.role}, SECRET_KEY, {expiresIn: "1h"});
    return res.status(200).json({message: "Logged In successfully!", token: token});
}

module.exports = {registerUser, loginUser};