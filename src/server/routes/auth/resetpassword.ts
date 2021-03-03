import { getModelForClass } from "@typegoose/typegoose";
import { hashSync } from "bcrypt";
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { readFileSync } from "fs";
import { sign, verify } from "jsonwebtoken";
import { createTransport } from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import { log, type } from "../../../io/log";
import { User } from "../../models/user";
import { userExistsUsingEmail } from "../../validators/exists";

const router = Router();
router.post(
	"/getToken",
	[
		body("email")
			.notEmpty()
			.withMessage("Email is a required field!")
			.bail()
			.isEmail()
			.withMessage("Must be a valid email!")
			.bail()
			.custom(userExistsUsingEmail),
	],
	async (req: Request, res: Response) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json(errors);
			res.end();
		} else {
			let smtp = new SMTPTransport({
				host: process.env.SMTP_SERVER,
				port: parseInt(process.env.SMTP_PORT),
				secure: process.env.SMTP_SECURE === "true" ? true : false,
				auth: {
					user: process.env.SMTP_USERNAME,
					pass: process.env.SMTP_PASSWORD,
				},
			});
			let transporter = createTransport(smtp);
			let user = await getModelForClass(User).findOne({
				email: req.body.email,
			});
			let token = sign(
				{
					userId: user._id,
					resetToken: true,
				},
				process.env.JWT_SECRET_KEY,
				{
					expiresIn: 60 * 5,
				},
			);
			let template = readFileSync(
				__dirname + "../../templates/passwordResetTemplate.html",
			);
			let mailBody = template.toString();
			mailBody.replace("{%email%}", user.email);
			mailBody.replace("{%token%}", token);
			try {
				transporter.sendMail({
					to: user.email,
					html: mailBody,
				});
			} catch (e) {
				log(
					"Failed to send password reset email to client! Check if the configurations are correct",
					type.ERROR,
				);
				log(e.message, type.ERROR);
				log(e.stack, type.ERROR);
				res.status(500);
				res.end();
			}
			res.status(200);
			res.end();
		}
	},
);

router.post(
	"/resetpassword",
	[
		body("resetToken")
			.notEmpty()
			.withMessage("Reset token is required!")
			.bail()
			.isJWT()
			.withMessage("Invalid reset token!")
			.bail(),
		body("password")
			.notEmpty()
			.bail()
			.isLength({
				min: 8,
				max: 100,
			})
			.withMessage("Password must have length between 8 and 100"),
	],
	async (req: Request, res: Response) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json(errors);
			res.end();
		} else {
			try {
				let payload: any = verify(
					req.body.resetToken,
					process.env.JWT_SECRET_KEY,
				);
				let userId = payload.userId;
				if (!payload.resetToken) {
					throw new Error();
				}
				let user = await getModelForClass(User).findOne(userId);
				if (!user) {
					res.status(404);
					res.end();
				} else {
					let saltedPassword = hashSync(user.password, 10);
					user.password = saltedPassword;
					user.save();
					res.status(200);
					res.end();
				}
			} catch (e) {
				res.status(403);
				res.end();
			}
		}
	},
);

export const resetpasswordRouter = router;