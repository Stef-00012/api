import { Duration } from "luxon";

export default function convertSecondsToTime(seconds: number): string {
    const duration = Duration.fromObject({
        seconds,
    });

    const splitDuration = duration.toFormat("yy:MM:dd:hh:mm:ss").split(":");

    while (splitDuration[0] === "00") {
        splitDuration.shift();
    }

    return splitDuration.join(":");
}