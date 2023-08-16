"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthenticateJwt = exports.authenticateJwt = exports.USER_SECRET = exports.SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.SECRET = 'SEC3t';
exports.USER_SECRET = 'SECUSER3T';
//generate jwt for sign up,
//export const authenticateJwt = () => (req:Request, res:Response,next:NextFunction)=>{
const authenticateJwt = (req, res, next) => {
    console.log("inside middlewate");
    let authHeader = req.headers.authorization;
    console.log("authHeader inside middlewate", authHeader);
    if (authHeader) {
        console.log("inside authHeader");
        let token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, exports.SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "forbiddeb: {}", err });
                //return res.sendStatus(403)
            }
            else {
                console.log(user);
                req.userId = user.id;
                next();
            }
        });
    }
    else {
        console.log("inside authHeader else");
        res.sendStatus(400);
    }
};
exports.authenticateJwt = authenticateJwt;
const userAuthenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        let token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, exports.USER_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "forbidden", err });
            }
            console.log("user in user authenticate", user);
            req.userId = user.id;
            next();
        });
    }
    else {
        return res.status(400).json({ message: "authentication not provided" });
    }
};
exports.userAuthenticateJwt = userAuthenticateJwt;
