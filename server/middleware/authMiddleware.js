import JsonWebToken from "jsonwebtoken";

export const verifyToken=(req, res, next)=>{
    try{
        // Get token from headers
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).send({ message: "Unauthorized. Please login again." });
        }
        const token = authHeader.split(' ')[1] // token is present after Bearer

        if(!token){
            return res.status(401).send({ message: "Unauthorized. Please login again." });
        }

        const decoded = JsonWebToken.verify(token, process.env.SECRET_KEY);

        // Attach User info to request Obj
        req.user = decoded;

        next();
    }catch(error){
        return res.status(401).send({ message: "Unauthorized. Please login again." });
    }
}