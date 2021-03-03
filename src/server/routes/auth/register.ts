import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import {
	isUniqueEmail,
	isUniqueUsername,
} from "../../validators/isUniqueField";
import { hashSync } from "bcrypt";
import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../../models/user";

const router = Router();
router.post(
	"/",
	[
		body("username")
			.notEmpty()
			.withMessage("Username is a required field!")
			.bail()
			.isString()
			.withMessage("Username must be a string!")
			.bail()
			.isLength({
				max: 25,
				min: 1,
			})
			.withMessage("Username must have length between 1 and 25")
			.bail()
			.custom(isUniqueUsername),
		body("email")
			.notEmpty()
			.withMessage("Email is a required field!")
			.bail()
			.isEmail()
			.withMessage("Must be a valid email!")
			.bail()
			.custom(isUniqueEmail),
		body("password")
			.notEmpty()
			.withMessage("Password cannot be empty!")
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
			let saltedPassword = hashSync(req.body.password, 10);
			let userModel = getModelForClass(User);
			await userModel.create({
				username: req.body.username,
				email: req.body.email,
				password: saltedPassword,
			});
			res.status(200);
			res.end();
		}
	},
);

export const registerRouter = router;
