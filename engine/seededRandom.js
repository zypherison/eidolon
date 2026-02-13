/**
 * Seeded PRNG and Hashing Utility
 * Ensures deterministic variation based on username
 */

export function hashString(str) {
    let hash = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
    }
    return hash >>> 0;
}

export function createPRNG(seed) {
    let state = typeof seed === 'string' ? hashString(seed) : seed;

    // Mulberry32 generator
    return () => {
        state |= 0; state = state + 0x6D2B79F5 | 0;
        let t = Math.imul(state ^ state >>> 15, 1 | state);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
