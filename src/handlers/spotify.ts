import { add } from "date-fns/add";
import path from "node:path";
import axios from "axios";
import fs from "node:fs";

const spotifyDataPath = path.join(__dirname, "..", "data", "spotify.json");

const defaultMessage =
	process.env.SPOTIFY_DEFAULT_NO_DATA_MESSAGE || "Loading...";

const newData = {
	daily: {
		songs: {
			total: defaultMessage,
			different: defaultMessage,
		},
		artists: {
			different: defaultMessage,
		},
	},
	monthly: {
		songs: {
			total: defaultMessage,
			different: defaultMessage,
		},
		artists: {
			different: defaultMessage,
		},
	},
	yearly: {
		songs: {
			total: defaultMessage,
			different: defaultMessage,
		},
		artists: {
			different: defaultMessage,
		},
	},
	total: {
		songs: {
			total: defaultMessage,
			different: defaultMessage,
		},
		artists: {
			different: defaultMessage,
		},
	},
};

const end = new Date();
const endString = end.toISOString();

const startStrings = {
	daily: add(end, {
		days: -1,
	}).toISOString(),
	monthly: add(end, {
		months: -1,
	}).toISOString(),
	yearly: add(end, {
		years: -1,
	}).toISOString(),
	total: process.env.SPOTIFY_JOIN_DATE,
};

async function updateSpotifyData() {
	console.log("Updating Spotify data...");

	if (!fs.existsSync(spotifyDataPath)) {
		fs.writeFileSync(spotifyDataPath, JSON.stringify(newData, null, 2));
	}

	for (const _start in startStrings) {
		const start = _start as keyof typeof startStrings;

		try {
			const songsData = await axios.get(
				`${process.env.YOUR_SPOTIFY_API_URL}/spotify/songs_per?start=${startStrings[start]}&end=${endString}&timeSplit=all&token=${process.env.YOUR_SPOTIFY_API_TOKEN}`,
			);

			const artistsData = await axios.get(
				`${process.env.YOUR_SPOTIFY_API_URL}/spotify/different_artists_per?start=${startStrings[start]}&end=${endString}&timeSplit=all&token=${process.env.YOUR_SPOTIFY_API_TOKEN}`,
			);

			if (songsData.data?.length) {
				newData[start].songs = {
					total: songsData.data[0].count,
					different: songsData.data[0].differents,
				};
			}

			if (artistsData.data?.length) {
				newData[start].artists = {
					different: artistsData.data[0].differents,
				};
			}
		} catch(_e) {
			console.error("Failed to fetch spotify data")
		}
	}

	fs.writeFileSync(spotifyDataPath, JSON.stringify(newData, null, 2));
}

updateSpotifyData();

setInterval(
	updateSpotifyData,
	Number.parseInt(process.env.SPOTIFY_UPDATE_INTERVAL || "60000"),
); // Update every minute
