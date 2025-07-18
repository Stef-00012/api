import express from "express";
import cors from "cors";

import "@/handlers/spotify";
import "@/handlers/birthdays";
import "@/handlers/errors";

import { routes } from "./routes/routes";

const ignoredLogsEndpoints = [
	/^\/status$/,
	/^\/favicon\.(gif|png|ico)$/,
	/^\/\.well-known(\/.*)?$/,
];


const app = express();

app.use(
	cors(),
	(req, res, next) => {
		if (
			ignoredLogsEndpoints.some((endpoint) =>
				endpoint.test(req.originalUrl.split("?")[0]),
			)
		)
			return next();

		const start = Date.now();

		res.on("finish", () => {
			const responseTime = Date.now() - start;
			const contentLength = res.get("Content-Length");
			const socketIp = req.socket.remoteAddress;
			const XForwardedForIp = req.header("x-forwarded-for")?.split(", ") ?? [];

			console.log({
				method: req.method,
				url: req.originalUrl.split("?")[0],
				query: req.query,
				responseTime: `${responseTime} ms`,
				contentLength: `${contentLength} bytes`,
				status: res.statusCode,
				ip: {
					socket: socketIp,
					XForwardedFor:
						XForwardedForIp.length > 0
							? {
									clientIp: XForwardedForIp.shift(),
									proxyIps: XForwardedForIp.join(" - "),
								}
							: undefined,
				},
			});
		});

		next();
	},
	...routes
);

app.get("/", (_req, res) => {
	res.redirect("https://stefdp.com");
});

app.get("/status", (_req, res) => {
	res.sendStatus(200);
});

app.all(/(.*)/, (_req, res) => {
	res.status(404).json({
		error: "Not Found",
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log("API listening on port", process.env.PORT || 3000);
});
