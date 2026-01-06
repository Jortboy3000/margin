# Bunny.net Video Migration - Quick Reference

## After You Upload Videos to Bunny.net

### 1. Update `src/bunny-config.js`

Replace the placeholder values:

```javascript
export const BUNNY_CONFIG = {
    libraryId: '12345',  // Your actual library ID
    cdnHostname: 'vz-abc123.b-cdn.net',  // Your actual CDN hostname
};

export const videos = {
    intro: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  // Actual GUIDs
    mercyOfOthers: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    // ... etc
};
```

### 2. Update HTML Files

#### Option A: Using HLS Streaming (Recommended)

```html
<!-- Before -->
<video autoplay muted loop playsinline preload="auto">
    <source src="/mercyofothers.mp4" type="video/mp4">
</video>

<!-- After -->
<video 
    data-hls 
    data-src="https://vz-abc123.b-cdn.net/GUID/playlist.m3u8"
    data-fallback="https://vz-abc123.b-cdn.net/GUID/play_720p.mp4"
    autoplay 
    muted 
    loop 
    playsinline 
    preload="auto">
</video>
```

#### Option B: Using Bunny's Iframe Player

```html
<!-- Before -->
<video autoplay muted loop playsinline>
    <source src="/mercyofothers.mp4" type="video/mp4">
</video>

<!-- After -->
<div style="position: relative; padding-top: 56.25%;">
    <iframe 
        src="https://iframe.mediadelivery.net/embed/12345/GUID?autoplay=true&loop=true&muted=true"
        loading="lazy"
        style="border: none; position: absolute; top: 0; height: 100%; width: 100%;"
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
        allowfullscreen>
    </iframe>
</div>
```

### 3. Using Helper Functions

```javascript
import { getVideoUrl, getHLSUrl, getIframeUrl } from './bunny-config.js';

// Get direct MP4 URL
const mp4Url = getVideoUrl('mercyOfOthers', '1080p');

// Get HLS stream URL
const hlsUrl = getHLSUrl('mercyOfOthers');

// Get iframe embed URL
const iframeUrl = getIframeUrl('mercyOfOthers', {
    autoplay: true,
    loop: true,
    muted: true
});
```

## Files to Update

1. **index.html** - Intro video, featured video
2. **brand-advertising.html** - Commercial video
3. **film-and-television.html** - Film videos (mercy, balaclava, sacrifice, tkg)
4. **showreels-and-self-tapes.html** - Showreels video

## Testing Checklist

- [ ] Videos load and play correctly
- [ ] Adaptive streaming works (check Network tab)
- [ ] Fallback to MP4 works if HLS fails
- [ ] Mobile devices can play videos
- [ ] Autoplay works (muted videos only)
- [ ] No console errors

## Benefits

✅ 80-90% bandwidth savings  
✅ Adaptive quality based on connection  
✅ Global CDN delivery  
✅ Smaller git repository  
✅ Professional streaming infrastructure
