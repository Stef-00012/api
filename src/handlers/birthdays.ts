import type { Birthday } from "@/types/birthdays";
import getNextDay from "@/functions/getNextDay";
import cron from "node-cron";
import axios from "axios";

import _birthdays from "@/data/birthdays.json";
import getCurrentDay from "@/functions/getCurrentDay";
const birthdays = _birthdays as Birthday[];

cron.schedule("50 23 * * *", async () => {
    console.log("Checking for birthdays (next day)...");
    const nextDay = getNextDay();

    const todayBirthdays = birthdays.filter(
        (birthday) => birthday.date === nextDay,
    );

    if (todayBirthdays.length > 0) {
        const birthdaysByTopic: Record<string, string[]> = {};

        for (const bday of todayBirthdays) {
            if (!birthdaysByTopic[bday.topic]) birthdaysByTopic[bday.topic] = [bday.name];
            else birthdaysByTopic[bday.topic].push(bday.name);
        }

        for (const topic in birthdaysByTopic) {
            const names = birthdaysByTopic[topic];

            try {
                await axios.post(`${process.env.NTFY_URL}`, {
                    topic,
                    message: names.join(", "),
                    priority: 4, // https://docs.ntfy.sh/publish/#message-priority
                    title: "Tomorrow (in 10 minutes) is someone's birhday!"
                }, {
                    headers: {
                        Authorization: `Bearer ${process.env.NTFY_TOKEN}`,
                    }
                })
            } catch(_e) {
                console.error(_e)
            }
        }
    }
}, {
    timezone: process.env.TZ || "Europe/Rome",
})

cron.schedule("00 7 * * *", async () => {
    console.log("Checking for birthdays (current day)...");
    const currentDay = getCurrentDay();

    const todayBirthdays = birthdays.filter(
        (birthday) => birthday.date === currentDay,
    );

    if (todayBirthdays.length > 0) {
        const birthdaysByTopic: Record<string, string[]> = {};

        for (const bday of todayBirthdays) {
            if (!birthdaysByTopic[bday.topic]) birthdaysByTopic[bday.topic] = [bday.name];
            else birthdaysByTopic[bday.topic].push(bday.name);
        }

        for (const topic in birthdaysByTopic) {
            const names = birthdaysByTopic[topic];

            try {
                await axios.post(`${process.env.NTFY_URL}`, {
                    topic,
                    message: names.join(", "),
                    priority: 4, // https://docs.ntfy.sh/publish/#message-priority
                    title: "Tomorrow (in 10 minutes) is someone's birhday!"
                }, {
                    headers: {
                        Authorization: `Bearer ${process.env.NTFY_TOKEN}`,
                    }
                })
            } catch(_e) {
                console.error(_e)
            }
        }
    }
}, {
    timezone: process.env.TZ || "Europe/Rome",
})