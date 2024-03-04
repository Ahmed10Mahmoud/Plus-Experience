export function showMethod(req, res, next) {
    console.log(`${req.method} : ${req.url}`);
    next();
};