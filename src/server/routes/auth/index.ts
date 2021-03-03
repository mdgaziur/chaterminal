import { Router } from "express";
import { loginRouter } from "./login";
import { registerRouter } from "./register";
import { resetpasswordRouter } from "./resetpassword";

const router = Router();
router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/resetpassword', resetpasswordRouter);

export const authRouter = router;