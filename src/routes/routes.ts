import { router as spotifyDataRouter } from "./spotify/spotify";
import { router as spotifyReceiptRouter } from "./receipt/spotify";
import { router as lastFmReceiptRouter } from "./receipt/last.fm";

export const routes = [
    spotifyDataRouter,
    spotifyReceiptRouter,
    lastFmReceiptRouter,
]