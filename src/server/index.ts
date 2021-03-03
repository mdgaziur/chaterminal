import { yellow } from "colors/safe";
import express from "express";
import morgan from "morgan";
import { log, type } from "../io/log";
import { authRouter } from "./routes/auth";
import { verifyRouter } from "./routes/verify";
import { createServer } from "http";
import * as socketio from "socket.io";
import isValidAuthToken from "./validators/authToken";
import getUserFromAuthToken from "./utils/getUser";
import { mongoose } from "@typegoose/typegoose";
import { queryRouter } from "./routes/query";

export type socketPayload = {
	message: string;
	authToken: string;
};

require("dotenv").config(); // get dotenv config :)

export default function server() {
	const app = express();
	const server = createServer(app);
	const io = require("socket.io")(server);

	io.on("connection", async (socket: socketio.Socket) => {
		socket.on("send-message", async (payload: socketPayload) => {
			let authToken = payload.authToken;
			if (!isValidAuthToken(authToken)) {
				return;
			}
			let user = await getUserFromAuthToken(authToken);
			if (!user) {
				return;
			}
			let transportedPayload = {
				body: payload.message,
				user: user.username
			}
			socket.broadcast.emit("message", transportedPayload);
		});
	});

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(
		morgan((tokens, req, res) => {
			return yellow(
				[
					req.ip,
					" ",
					tokens.method(req, res),
					" ",
					tokens.url(req, res),
					" ",
					tokens.status(req, res),
					" ",
					"[",
					new Date().toUTCString(),
					"] ",
					tokens.res(req, res, "content-length"),
					" - ",
					tokens["response-time"](req, res),
					" ms",
				].join(""),
			);
		}),
	);

	app.use("/auth", authRouter);
	app.use("/verify", verifyRouter);
	app.use("/query", queryRouter);

	mongoose.connect(
		process.env.MONGODB_URI,
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
		},
		(err) => {
			if (err) {
				log(
					"Error occured trying to connect to mongodb database. I quit!",
					type.ERROR,
				);
				log(err.message, type.ERROR);
				log(err.stack);
			} else {
				server.listen(6396, async () => {
					log(`Started server on ${6396}`, type.SUCCESS);
				});
			}
		},
	);
}
