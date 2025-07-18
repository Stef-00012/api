import express from "express";
import path from "node:path";
import fs from "node:fs";

const spotifyDataPath = path.join(
	__dirname,
	"..",
	"..",
	"data",
	"spotify.json",
);

export const router = express.Router();

router.get("/spotify/:period", (req, res) => {
	if (!["daily", "monthly", "yearly", "total"].includes(req.params.period)) {
		return res.status(400).json({
			error:
				"Invalid period specified. Valid periods are: daily, monthly, yearly, total.",
		});
	}

	const dataString = fs.readFileSync(spotifyDataPath, "utf-8");

	const data = JSON.parse(dataString);

	if (!data[req.params.period]) return res.sendStatus(404);

	return res.json(data[req.params.period]);
});
