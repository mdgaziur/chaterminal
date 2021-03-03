import { getModelForClass } from "@typegoose/typegoose";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { verify } from "jsonwebtoken";
import { User } from "../../models/user";

const router = Router();

router.post('/username', [
    body('authToken')
        .notEmpty()
        .withMessage("Authtoken is required!")
        .isJWT()
        .withMessage("Invalid jwt!")
], async(req: Request, res: Response) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json(errors).end();
    } else {
        try {
            let payload: any = verify(req.body.authToken, process.env.JWT_SECRET_KEY);
            let userId = payload.userId;
            let user = await getModelForClass(User).findOne({
                _id: userId
            });
            if(user) {
                res.json({
                    username: user.username
                });
                res.end();
            } else {
                res.status(400).end();
            }
        } catch {
            res.status(400).end();
        }
    }
});

export const queryRouter = router;