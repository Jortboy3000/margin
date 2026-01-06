// Bunny.net Stream Configuration
// Your actual Bunny.net Stream library details

export const BUNNY_CONFIG = {
    // From: Stream → Your Library → Settings
    libraryId: '571362',
    cdnHostname: 'vz-e3f7e942-92b.b-cdn.net',

    // From: Stream → Your Library → API
    // apiKey: 'REMOVED_FOR_SECURITY' 
};

// Video GUID mapping
// Your actual video GUIDs from Bunny.net
export const videos = {
    intro: '227d3865-fbb6-40b8-90e8-5bd2de32ecd0',              // sr_88_to_1_productions.mp4
    mercyOfOthers: 'a2122564-425b-4037-8523-8c46d5fd4fe3',     // mercyofothers.mp4
    commercial: '1268cf40-45d1-4f95-8900-0b30fd9ec828',        // comm.mp4
    balaclava: '3eadbe55-6465-48d7-98f3-5ed04c45a62a',         // balaclava.mp4
    sacrifice: '55e22838-c7d4-4114-99d1-71c2433af9b0',         // sacrifice.mp4
    tkg: '9999728e-0542-46ec-9ad6-0877d26b5f37',               // tkg.mp4
    showreels: '835115b7-b1c4-4aca-8a07-b0543e725d43'          // showreels.mp4
};

// Helper functions to generate video URLs
export function getVideoUrl(videoKey, quality = '720p') {
    const guid = videos[videoKey];
    if (!guid || guid.startsWith('GUID_')) {
        console.warn(`Video GUID not set for: ${videoKey}`);
        return '';
    }
    return `https://${BUNNY_CONFIG.cdnHostname}/${guid}/play_${quality}.mp4`;
}

export function getHLSUrl(videoKey) {
    const guid = videos[videoKey];
    if (!guid || guid.startsWith('GUID_')) {
        console.warn(`Video GUID not set for: ${videoKey}`);
        return '';
    }
    return `https://${BUNNY_CONFIG.cdnHostname}/${guid}/playlist.m3u8`;
}

export function getIframeUrl(videoKey, options = {}) {
    const guid = videos[videoKey];
    if (!guid || guid.startsWith('GUID_')) {
        console.warn(`Video GUID not set for: ${videoKey}`);
        return '';
    }

    const params = new URLSearchParams({
        autoplay: options.autoplay ?? false,
        loop: options.loop ?? false,
        muted: options.muted ?? false,
        preload: options.preload ?? true,
        responsive: options.responsive ?? true
    });

    return `https://iframe.mediadelivery.net/embed/${BUNNY_CONFIG.libraryId}/${guid}?${params}`;
}

// Check if Bunny config is set up
export function isBunnyConfigured() {
    return !BUNNY_CONFIG.libraryId.startsWith('YOUR_') &&
        !BUNNY_CONFIG.cdnHostname.startsWith('vz-YOUR-');
}
