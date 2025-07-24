import type { NtfyMessageBody } from "@/types/ntfy-sh";
import axios from "axios";

export async function sendNotification(topic: string, data: NtfyMessageBody = {}) {
    try {
		await axios.post(`${process.env.NTFY_URL}`, {
			topic,
			...data
		}, {
			headers: {
				Authorization: `Bearer ${process.env.NTFY_TOKEN}`,
			}
		});
	} catch(e) {
		console.error("Failed to send error notification:", e);
	}
}