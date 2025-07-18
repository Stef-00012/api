import { Duration } from "luxon";

export default function convertMsToTime(milliseconds: number): string {
    {
		const duration = Duration.fromObject({
			milliseconds
		});

		const splitDuration = duration.toFormat("yy:MM:dd:hh:mm:ss").split(":");

		while (splitDuration[0] === "00") {
			splitDuration.shift();
		}

		return splitDuration.join(":");
	}
}