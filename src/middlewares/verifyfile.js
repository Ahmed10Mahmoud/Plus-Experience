
export function verifyFile(typeList = []) {
    return (req, res, next) => {
        if (typeList.includes(req.file.mimetype)) {
            next();
        }
        else
            res.status(415).json({ "msg": "Please upload a the right file" });
    };
}
