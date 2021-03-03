import blessed from "neo-blessed";
import * as io from "socket.io-client";
import getUserNameFromAuthToken from "../utils/getUserNameFromAuthToken";
import { readConfig } from "../utils/readConfig";

export default function startChaterminalUI() {
	const screen = blessed.screen();
	screen.title = "Chaterminal";

	let chatMessegesBox = blessed.list({
		align: "left",
		mouse: true,
		keys: true,
		width: "100%",
		height: "90%",
		top: 0,
		left: 0,
		scrollbar: {
			ch: " ",
		},
		items: [],
	});

	var inputBox = blessed.textarea({
		bottom: 0,
		height: "10%",
		inputOnFocus: true,
		padding: {
			top: 1,
			left: 2,
			bottom: 1,
		},
		style: {
			fg: "#787878",
			bg: "#454545",

			focus: {
				fg: "#f6f6f6",
				bg: "#353535",
			},
		},
		vi: true,
	});

	screen.key(["escape", "q", "C-c"], () => {
		return process.exit(0);
	});

	screen.key(["c"], () => {
		return inputBox.focus();
	});

	screen.append(chatMessegesBox);
	screen.append(inputBox);

	inputBox.focus();

	screen.render();

	const config = readConfig();
	const socket = io.connect(config.server);

	socket.on("message", (payload) => {
		chatMessegesBox.addItem(`${payload.user}: ${payload.body}`);
		chatMessegesBox.focus();
	});

	inputBox.key(["enter"], async () => {
		chatMessegesBox.addItem(blessed.escape(`${await getUserNameFromAuthToken(config.server, config.authToken)}: ${inputBox.getValue()}`));
		socket.emit("send-message", {
			authToken: config.authToken,
			message: inputBox.getValue(),
		});
		chatMessegesBox.focus();
		inputBox.setValue("");
	});
}
