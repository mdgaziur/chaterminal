import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { compareSync } from "bcrypt";
import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../../models/user";
import { userExists } from "../../validators/exists";
import { sign } from "jsonwebtoken";

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
			.custom(userExists),
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
			let userModel = getModelForClass(User);
			let user = await userModel.findOne({
				username: req.body.username,
			});
			let password = req.body.password;
			let correctPassword = compareSync(password, user.password);
			if (!correctPassword) {
				res.status(403);
				res.end();
			} else {
				let authToken = sign(
					{
						userId: user._id,
						resetToken: false,
					},
					process.env.JWT_SECRET_KEY,
					{
						expiresIn: 60 * 60 * 24 * 30,
					},
				);
				res.json({
					token: authToken,
				});
				res.end();
			}
		}
	},
);

export const loginRouter = router;
