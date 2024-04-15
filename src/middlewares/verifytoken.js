import jwt from 'jsonwebtoken';
export function verifyToken(req, res, next) {
    //const token = req.cookies.jwt;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    if (token) {
        jwt.verify(token, 'salah&ahmed', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.status(401).json({ "msg": "Invalid token!" });
            }
            else {
                console.log(decodedToken);
                req.id = decodedToken.id;
                req.role = decodedToken.role;
                next();
            }
        });
    }
    else {
        res.status(401).json({ "msg": "Unauthorized!" });
    }
};