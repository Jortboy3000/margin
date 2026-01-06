import './style.css'
import Lenis from '@studio-freight/lenis'
import { initLazyVideos } from './lazy-video.js'
import Hls from 'hls.js'
import { isBunnyConfigured } from './bunny-config.js'
import { inject } from '@vercel/analytics';

inject();

console.log('88to1 Productions - Loaded');

// Lenis Smooth Scroll Initialization
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Mobile Checks
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// We now allow muted autoplay on mobile for that premium feel
// Browsers will handle the restriction automatically if needed



// HLS Video Initialization for Bunny.net streams
function initHLSVideos() {
    const videos = document.querySelectorAll('video[data-hls]');

    videos.forEach(video => {
        const src = video.dataset.src;
        if (!src) return;

        if (Hls.isSupported()) {
            const hls = new Hls({
                // Performance optimizations
                enableWorker: true,
                lowLatencyMode: false,

                // Buffer configuration for smoother playback
                maxBufferLength: 30,              // Max buffer ahead (seconds)
                maxMaxBufferLength: 60,            // Absolute max buffer
                maxBufferSize: 60 * 1000 * 1000,   // 60MB max buffer size
                maxBufferHole: 0.5,                // Max gap to skip

                // Faster quality switching
                abrEwmaDefaultEstimate: 5000000,   // Initial bandwidth estimate (5 Mbps)
                abrBandWidthFactor: 0.95,          // Use 95% of bandwidth
                abrBandWidthUpFactor: 0.7,         // Switch up at 70% bandwidth

                // Loading optimizations
                manifestLoadingTimeOut: 10000,
                manifestLoadingMaxRetry: 3,
                levelLoadingTimeOut: 10000,
                fragLoadingTimeOut: 20000,

                // Start from optimal quality
                startLevel: -1,                    // Auto-select best quality

                // Reduce rebuffering
                nudgeOffset: 0.1,
                nudgeMaxRetry: 3,

                // Better error recovery
                fragLoadingMaxRetry: 6,
                levelLoadingMaxRetry: 4,
            });

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS stream ready:', src);
                // Log available quality levels
                console.log('Available qualities:', hls.levels.map(l => `${l.height}p`));
            });

            // Monitor quality changes
            hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                const level = hls.levels[data.level];
                console.log(`Quality switched to: ${level.height}p`);
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('HLS fatal error:', data);
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('Network error, trying to recover...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('Media error, trying to recover...');
                            hls.recoverMediaError();
                            break;
                        default:
                            // Fallback to MP4
                            const fallbackSrc = video.dataset.fallback;
                            if (fallbackSrc) {
                                console.log('Falling back to MP4');
                                hls.destroy();
                                video.src = fallbackSrc;
                            }
                            break;
                    }
                }
            });

            // Store HLS instance for cleanup
            video.hlsInstance = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari, iOS)
            video.src = src;
        } else {
            // Fallback to MP4
            const fallbackSrc = video.dataset.fallback;
            if (fallbackSrc) {
                video.src = fallbackSrc;
            }
        }
    });
}

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (handled by CSS transition, or we can use animate)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect
    const interactiveElements = document.querySelectorAll('a, button, .menu-link, .video-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// Premium Custom Cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Tight tracking
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Simple hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .video-card, .hamburger-btn, .menu-link');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Using default cursor - clean and simple

    // Initialize lazy video loading
    initLazyVideos({
        rootMargin: '100px',
        threshold: 0.25,
        autoplay: true,
        unloadOnExit: false
    });

    // Initialize HLS videos if Bunny.net is configured
    if (isBunnyConfigured()) {
        initHLSVideos();
    }

    const elementsToAnimate = document.querySelectorAll('section > .container > *, article');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('fade-in-section');
        // Add staggering delay
        el.style.transitionDelay = `${index % 3 * 100}ms`;
        observer.observe(el);
    });

    // Intro Animation Sequence
    const intro = document.getElementById('intro');
    if (intro) {
        // Quick AF (2.5s) on mobile, Standard (4s) on desktop
        const duration = isMobile ? 2500 : 4000;

        setTimeout(() => {
            intro.classList.add('tv-off');
            // Remove from DOM after transition
            setTimeout(() => {
                intro.style.display = 'none';
            }, 600);
        }, duration);
    }

    // Hamburger Menu Logic
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const mainLogo = document.getElementById('main-logo');

    if (hamburgerBtn && menuOverlay && mainLogo) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = hamburgerBtn.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            mainLogo.classList.toggle('centered');
            // Prevent scrolling when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                menuOverlay.classList.remove('active');
                mainLogo.classList.remove('centered');
                document.body.style.overflow = '';
            });
        });

        // Logo Click Handler: Reset to home/top
        mainLogo.addEventListener('click', (e) => {
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

            if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Close menu if open (always do this just in case)
            if (menuOverlay.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                menuOverlay.classList.remove('active');
                mainLogo.classList.remove('centered');
                document.body.style.overflow = '';
            }
        });
        // Video Controls Logic
        const featuredVideo = document.getElementById('featured-video');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const muteBtn = document.getElementById('mute-btn');

        if (featuredVideo && playPauseBtn && muteBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (featuredVideo.paused) {
                    featuredVideo.play();
                    playPauseBtn.textContent = 'PAUSE';
                    playPauseBtn.setAttribute('aria-label', 'Pause Video');
                } else {
                    featuredVideo.pause();
                    playPauseBtn.textContent = 'PLAY';
                    playPauseBtn.setAttribute('aria-label', 'Play Video');
                }
            });

            muteBtn.addEventListener('click', () => {
                featuredVideo.muted = !featuredVideo.muted;
                muteBtn.textContent = featuredVideo.muted ? 'UNMUTE' : 'MUTE';
                muteBtn.setAttribute('aria-label', featuredVideo.muted ? 'Unmute Video' : 'Mute Video');
            });
        }
    }
});
