export interface SpotifyTopTracks {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyTrack[];
}

interface SpotifyTrack {
    album: SpotifyAlbum;
    artists: SimplifiedArtistObject[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: SpotifyTrackExternalIds;
    external_urls: SpotifyExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    // linked_from: SpotifyTrackLinkedFrom; # not sure what the object looks like
    restrictions: SpotifyRestrictions;
    name: string;
    popularity: number;
    track_number: number;
    type: "track";
    uri: string;
    is_local: boolean;
}

interface SpotifyAlbum {
    album_type: "album" | "single" | "compilation";
    total_tracks: number;
    available_markets: string[];
    external_urls: SpotifyExternalUrls;
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    restrictions: SpotifyRestrictions;
    type: "album";
    uri: string;
    artists: SimplifiedArtistObject[];
}

interface SpotifyExternalUrls {
    spotify: string;
}

interface SpotifyImage {
    url: string;
    height: number | null;
    width: number | null;
}

interface SpotifyRestrictions {
    reason: "market" | "product" | "explicit";
}

interface SimplifiedArtistObject {
    external_urls: SpotifyExternalUrls;
    href: string;
    id: string;
    name: string;
    type: "artist";
    uri: string;
}

interface SpotifyTrackExternalIds {
    isrc: string;
    ean: string;
    upc: string;
}