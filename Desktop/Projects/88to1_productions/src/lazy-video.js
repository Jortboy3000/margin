/**
 * Lazy Video Loading Utility
 * Uses Intersection Observer to load and play videos only when they enter the viewport
 * Reduces initial page load and memory usage
 */

class LazyVideoLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.25,
            autoplay: options.autoplay !== false,
            unloadOnExit: options.unloadOnExit || false,
            ...options
        };

        this.observer = null;
        this.videos = new Map();
        this.init();
    }

    init() {
        // Create Intersection Observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );

        // Find all videos with data-lazy attribute
        this.discoverVideos();
    }

    discoverVideos() {
        const lazyVideos = document.querySelectorAll('video[data-lazy]');
        lazyVideos.forEach(video => this.observe(video));
    }

    observe(video) {
        if (!video || this.videos.has(video)) return;

        this.videos.set(video, {
            loaded: false,
            playing: false,
            originalSrc: video.dataset.src || null
        });

        this.observer.observe(video);
    }

    unobserve(video) {
        if (!video) return;
        this.observer.unobserve(video);
        this.videos.delete(video);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            const video = entry.target;
            const videoData = this.videos.get(video);

            if (!videoData) return;

            if (entry.isIntersecting) {
                // Video entered viewport
                this.loadVideo(video, videoData);
            } else {
                // Video left viewport
                if (this.options.unloadOnExit) {
                    this.unloadVideo(video, videoData);
                } else {
                    // Just pause it
                    if (videoData.playing) {
                        video.pause();
                        videoData.playing = false;
                    }
                }
            }
        });
    }

    loadVideo(video, videoData) {
        if (videoData.loaded) {
            // Already loaded, just play if autoplay is enabled
            if (this.options.autoplay && !videoData.playing) {
                video.play().catch(err => {
                    console.warn('Video autoplay failed:', err);
                });
                videoData.playing = true;
            }
            return;
        }

        // Load the video source
        const sources = video.querySelectorAll('source[data-src]');

        if (sources.length > 0) {
            sources.forEach(source => {
                source.src = source.dataset.src;
                source.removeAttribute('data-src');
            });
        } else if (videoData.originalSrc) {
            video.src = videoData.originalSrc;
        }

        // Load the video
        video.load();
        videoData.loaded = true;

        // Play if autoplay is enabled
        if (this.options.autoplay) {
            video.addEventListener('loadeddata', () => {
                video.play().catch(err => {
                    console.warn('Video autoplay failed:', err);
                });
                videoData.playing = true;
            }, { once: true });
        }

        // Remove data-lazy attribute
        video.removeAttribute('data-lazy');
    }

    unloadVideo(video, videoData) {
        if (!videoData.loaded) return;

        // Pause and reset
        video.pause();
        video.currentTime = 0;

        // Remove sources to free memory
        video.removeAttribute('src');
        const sources = video.querySelectorAll('source');
        sources.forEach(source => {
            source.removeAttribute('src');
        });

        video.load(); // Reset the video element

        videoData.loaded = false;
        videoData.playing = false;
    }

    destroy() {
        this.observer.disconnect();
        this.videos.clear();
    }
}

// Auto-initialize on DOM ready
let lazyVideoLoader = null;

function initLazyVideos(options) {
    if (lazyVideoLoader) {
        lazyVideoLoader.destroy();
    }
    lazyVideoLoader = new LazyVideoLoader(options);
    return lazyVideoLoader;
}

// Export for use in modules
export { LazyVideoLoader, initLazyVideos };

// Also make available globally for inline scripts
if (typeof window !== 'undefined') {
    window.LazyVideoLoader = LazyVideoLoader;
    window.initLazyVideos = initLazyVideos;
}
