import { authenticateJWT } from "../../../middleware/authenticateJwt.js";
import express, { Request, Response, NextFunction } from "express";


export const router = express.Router();

router.get(
  "/kenf/nimrod/check-user-role",
  authenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "admin" && req.user.role !== "mps") {
      return res.status(403).json({ message: "You are not authorized" });
    }

    res.status(200).json({ message: "You are authorized", authorized: true });
  }
);