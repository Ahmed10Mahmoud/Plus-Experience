import jwt from 'jsonwebtoken';
export function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'salah', async (err, decodedToken) => {
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