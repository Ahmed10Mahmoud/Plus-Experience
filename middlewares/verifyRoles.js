import userModel from "../model/usermodel.js";

export const verifyRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Check if req.role is defined and if not, end the request with status code 401
            if (!req?.role) {
                return res.sendStatus(401);
            }

            // Find the user in the database
            const foundedUser = await userModel.findOne({ _id: req.id }).exec();
            if (!foundedUser) {
                return res.sendStatus(401);
            }

            // Log the user's role
            console.log("User role: " + foundedUser.role);

            // Check if the user's role is included in the allowed roles array
            if (!allowedRoles.includes(foundedUser.role)) {
                return res.sendStatus(401);
            }

            // If the user's role is allowed, continue to the next middleware
            next();
        } catch (error) {
            console.error(error);
            res.sendStatus(500); // Internal server error
        }
    };
};
