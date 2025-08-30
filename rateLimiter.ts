// Simple client-side rate limiter to prevent accidental spamming of the API.

const RATE_LIMIT_COUNT = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // within a 5-minute window

const REQUEST_TIMESTAMPS_KEY = 'billAnalyzerRequestTimestamps';

/**
 * Records the timestamp of the current request.
 */
export const recordRequest = () => {
    try {
        const timestamps = getTimestamps();
        timestamps.push(Date.now());
        // Keep only the timestamps within the last window to prevent the list from growing indefinitely
        const recentTimestamps = timestamps.filter(ts => Date.now() - ts < RATE_LIMIT_WINDOW);
        localStorage.setItem(REQUEST_TIMESTAMPS_KEY, JSON.stringify(recentTimestamps));
    } catch (e) {
        console.error("Could not record request timestamp in localStorage", e);
    }
};

/**
 * Checks if a new request is allowed based on the rate limit rules.
 * @returns An object indicating if the request is allowed and when the user can retry.
 */
export const checkRateLimit = (): { allowed: boolean; retryAfter: number } => {
    const timestamps = getTimestamps();
    const now = Date.now();

    // Filter out timestamps that are outside the current window
    const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);

    if (recentTimestamps.length >= RATE_LIMIT_COUNT) {
        const oldestRequest = recentTimestamps[0];
        const retryAfter = Math.ceil((oldestRequest + RATE_LIMIT_WINDOW - now) / 1000);
        return { allowed: false, retryAfter };
    }

    return { allowed: true, retryAfter: 0 };
};


/**
 * Helper function to safely retrieve and parse timestamps from localStorage.
 */
const getTimestamps = (): number[] => {
    try {
        const storedTimestamps = localStorage.getItem(REQUEST_TIMESTAMPS_KEY);
        if (storedTimestamps) {
            const parsed = JSON.parse(storedTimestamps);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Could not read timestamps from localStorage", e);
    }
    return [];
};
