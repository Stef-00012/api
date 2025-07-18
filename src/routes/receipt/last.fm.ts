import convertSecondsToTime from "@/functions/convertSecondsToTime";
import axios, { type AxiosError } from "axios";
import sum from "@/functions/sum";
import express from "express";

export const router = express.Router();

router.get("/receiptData/last.fm", async (req, res) => {
	const validPeriods = [
		"overall",
		"7day",
		"1month",
		"3month",
		"6month",
		"12month",
	];
	const periodLegend = {
		overall: "overall",
		"7day": "in the last week",
		"1month": "in the last month",
		"3month": "in the last 3 months",
		"6month": "in the last 6 months",
		"12month": "in the last year",
	};

	const method = "user.gettoptracks";
	const user = req.query.user ?? "Stef_DP";
	const format = "json";
	const limit = 1000;
	const tracksLimit =
		typeof Number.parseInt(String(req.query.trackCount)) === "number" &&
		Number.parseInt(String(req.query.trackCount))
			? Number.parseInt(String(req.query.trackCount))
			: 20;
	const inputPeriod = validPeriods.includes(String(req.query.period))
		? String(req.query.period)
		: "1month";

	const weekdays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const date = new Date();

    const searchParams = new URLSearchParams({
        method,
        user: String(user),
        api_key: process.env.LAST_FM_API_KEY || "",
        format,
        limit: limit.toString(),
        period: String(inputPeriod),
    });

	const url = `https://ws.audioscrobbler.com/2.0/?${searchParams}`;

	try {
		const request = await axios.get(url);

		let tracks = [...request.data.toptracks.track];

		const pageData = request.data.toptracks["@attr"];

		for (let fetch = 2; fetch <= pageData.totalPages; fetch++) {
			try {
                searchParams.set("page", fetch.toString())

				const paginatedUrl = `https://ws.audioscrobbler.com/2.0/?${searchParams}`;

				const paginatedRequest = await axios.get(paginatedUrl);

				tracks = [...tracks, ...paginatedRequest.data.toptracks.track];
			} catch (e) {
				console.log("error", e);
			}
		}

		tracks = tracks.map((track) => {
			return {
				name: track.name,
				artist: {
					url: track.artist.url,
					name: track.artist.name,
				},
				url: track.url,
				duration: convertSecondsToTime(
					Number.parseInt(track.duration),
				),
				durationSeconds: Number.parseInt(track.duration),
				totalDuration: convertSecondsToTime(
					Number.parseInt(track.duration) * Number.parseInt(track.playcount),
				),
				totalDurationSeconds:
					Number.parseInt(track.duration) * Number.parseInt(track.playcount),
				playCount: Number.parseInt(track.playcount),
			};
		});

		const tracksData = tracks.slice(0, tracksLimit);
		const totalTracks = Number.parseInt(pageData.total);

		const totalTimeSeconds = sum(
			tracks.map((track) => track.playCount * track.durationSeconds),
		);

		const subTotalTimeSeconds = sum(
			tracks
				.slice(0, tracksLimit)
				.map((track) => track.playCount * track.durationSeconds),
		);

		const total = {
			amount: sum(tracks.map((track) => track.playCount)),
			duration: convertSecondsToTime(totalTimeSeconds),
			timeSeconds: totalTimeSeconds,
		};
		const subTotal = {
			amount: sum(
				tracks.slice(0, tracksLimit).map((track) => track.playCount),
			),
			duration: convertSecondsToTime(subTotalTimeSeconds),
			timeSeconds: subTotalTimeSeconds,
		};
		const year = date.getFullYear();
		const period = periodLegend[String(inputPeriod) as keyof typeof periodLegend];
		const dateGenerated = `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
		const orderNumber =
			req.query.order ?? Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

		const username = user;
		const cardHolder = req.query.cardHolder ?? user;
		const authCode =
			req.query.authCode ??
			Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
		const thanks = req.query.thanks ?? "Thank you for using stef's website";

		return res.json({
			tracksData,
			totalTracks,
			tracks: tracks.slice(0, tracksLimit).length,
			total,
			subTotal,
			year,
			period,
			dateGenerated,
			orderNumber,
			username,
			cardHolder,
			authCode,
			thanks,
		});
	} catch (err) {
        const error = err as AxiosError;

		console.log(error);

		return res.status(error?.request?.res?.statusCode ?? 500).json({
			code: error?.request?.res?.statusCode ?? 500,
			message: "Something went wrong",
		});
	}
});