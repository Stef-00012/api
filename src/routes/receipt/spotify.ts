import convertMsToTime from "@/functions/convertMsToTime";
import type { SpotifyTopTracks } from "@/types/spotify";
import axios, { type AxiosError } from "axios";
import sum from "@/functions/sum";
import express from "express";

export const router = express.Router();

router.get("/receiptData/spotify", async (req, res) => {
	const accessToken = req.query.accessToken;

	if (!accessToken)
		return res.status(403).json({
			message: "Missing authorization",
		});

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

	try {
		const profileRequest = await axios.get("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const topTracksRequest = await axios.get(
			"https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		const topTracksData = topTracksRequest.data as SpotifyTopTracks;

		const spotifyUsername = profileRequest.data.display_name ?? "Unknown";

		const spotifyTracksData = topTracksData.items.map((track) => {
			return {
				name: track.name,
				artist: {
					url: track.artists[0].external_urls.spotify,
					name: track.artists[0].name,
				},
				artists: track.artists.map((artist) => {
					return {
						url: artist.external_urls.spotify,
						name: artist.name,
					};
				}),
				url: track.external_urls.spotify,
				duration: convertMsToTime(track.duration_ms),
				durationSeconds: Math.floor(track.duration_ms / 1000),
				totalDuration: convertMsToTime(track.duration_ms),
				totalDurationSeconds: Math.floor(track.duration_ms / 1000),
				playCount: "1",
			};
		});

		for (const index in spotifyTracksData) {
			const playCount =
				Number.parseInt(index) < 9
					? `0${Number.parseInt(index) + 1}`
					: `${Number.parseInt(index) + 1}`;

			spotifyTracksData[index].playCount = playCount;
		}

		const tracksData = spotifyTracksData;
		const totalTracks = topTracksData.total;

		const total = {
			amount: topTracksData.total,
			duration: convertMsToTime(
				sum(topTracksData.items.map((track) => track.duration_ms)),
			),
			durationSeconds: sum(
				topTracksData.items.map((track) =>
					Math.floor(track.duration_ms / 1000),
				),
			),
		};
		const subTotal = {
			amount: topTracksData.limit,
			duration: convertMsToTime(
				sum(topTracksData.items.map((track) => track.duration_ms)),
			),
			durationSeconds: sum(
				topTracksData.items.map((track) =>
					Math.floor(track.duration_ms / 1000),
				),
			),
		};
		const year = date.getFullYear();
		const period = "Spotify";
		const dateGenerated = `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
		const orderNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

		const username = spotifyUsername;
		const cardHolder = spotifyUsername;
		const authCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
		const thanks = "Thank you for using stef's website";

		return res.json({
			tracksData,
			totalTracks,
			tracks: spotifyTracksData.slice(0, 50).length,
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
