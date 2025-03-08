import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export const authenticateWebSocket = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided."));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(new Error("Authentication error: Invalid token."));
            }

            socket.user = user;
            next();
        });
    } catch (error) {
        next(new Error("Authentication error: Unable to verify token."));
    }
};
