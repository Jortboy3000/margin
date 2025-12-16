// Telemetry Utils
// Wraps error reporting so we can swap providers (Sentry/LogRocket) easily.

(function (global) {
    global.TelemetryUtils = {
        init() {
            console.log("Margin: Telemetry Initialized");
            // Placeholder for Sentry init
            // Sentry.init({ dsn: "..." });
        },

        captureError(error, context = {}) {
            // 1. Log to console for dev
            console.error("Margin Telemetry:", error, context);

            // 2. Send to Sentry (if configured)
            // if (typeof Sentry !== 'undefined') {
            //    Sentry.captureException(error, { extra: context });
            // }
        },

        captureBreadcrumb(message, data = {}) {
            // console.log("Breadcrumb:", message, data);
            // if (typeof Sentry !== 'undefined') {
            //    Sentry.addBreadcrumb({ message, data });
            // }
        }
    };
})(typeof window !== 'undefined' ? window : self);
