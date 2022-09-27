const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const token = req.headers['authorization'].split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=> {

        try {
            if (err) {
                return res.status(401).send({
                    message: "Auth Failed",
                    success: false
                });
            } else {
                req.userId = decoded.id;
                next();
            }

        }catch(error){
            return res.status(401).send({
                message: "Auth Failed",
                success: false
            });
        }
    })

}