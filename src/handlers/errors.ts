import axios from "axios";
import fs from "node:fs";
import path from "node:path";

const errorsDir = path.join(__dirname, "../errors");

process.on("uncaughtException", async (err) => {
	if (!fs.existsSync(errorsDir)) {
		fs.mkdirSync(errorsDir);
	}

	const now = new Date();
	const dateStr = now.toISOString().slice(0, 10);
	const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "-");
	const timestamp = `${dateStr}_${timeStr}`;

	const errorMessage = `Event: uncaughtException\nName: ${err.name}\nMessage: ${err.message}\nStack trace:\n\n${err.stack}`;

	console.log(
		`\n\x1b[31m${errorMessage.split("\n").join("\n\x1b[31m")}\n\x1b[0m`,
	);

	const errorPath = path.join(errorsDir, `${timestamp}.txt`);

	fs.writeFileSync(errorPath, errorMessage);

	await axios.post(`${process.env.NTFY_URL}`, {
		topic: "apiErrors",
		priority: 4, // https://docs.ntfy.sh/publish/#message-priority
		title: "There was an error in the personal API",
		message: err.stack,
	});
});

process.on("unhandledRejection", async (reason, _promise) => {
	if (!fs.existsSync(errorsDir)) {
		fs.mkdirSync(errorsDir);
	}

	const now = new Date();
	const dateStr = now.toISOString().slice(0, 10);
	const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "-");
	const timestamp = `${dateStr}_${timeStr}`;

	const errorMessage = `Event: unhandledRejection\nReason:\n${reason}`;

	console.log(
		`\n\x1b[31m${errorMessage.split("\n").join("\n\x1b[31m")}\n\x1b[0m`,
	);

	const errorPath = path.join(errorsDir, `${timestamp}.txt`);

	fs.writeFileSync(errorPath, errorMessage);

	await axios.post(`${process.env.NTFY_URL}`, {
		topic: "apiErrors",
		priority: 4, // https://docs.ntfy.sh/publish/#message-priority
		title: "There was an error in the personal API",
		message: reason,
	});
});
