import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import isValidAuthToken from "../../validators/authToken";

const router = Router();
router.post('/user', [
    body('authToken')
        .notEmpty()
        .withMessage("Authtoken is required!")
        .isJWT()
        .withMessage("Invalid jwt!")
], async (req: Request, res: Response) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400);
        res.send(errors);
        res.end();
    } else {
        let authToken = req.body.authToken;
        if(await isValidAuthToken(authToken)) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    }
});
router.all('/', (req: Request, res: Response) => {
    res.send('Chaterminal');
});

export const verifyRouter = router;