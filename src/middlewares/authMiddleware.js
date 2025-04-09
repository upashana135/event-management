const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authorization = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token){
        return res.status(401).json({error: "Authorization token missing"});
    }
    let verifiedToken;
    try{
        verifiedToken = jwt.verify(token, SECRET_KEY);
        req.verifiedToken = verifiedToken;
        next();
    }catch(error){
        return res.status(401).json({error: "Invalid token!"})
    }
}

module.exports = {authorization}