import fs from 'fs/promises';
import path from 'path';

/**
 * Procedural SVG Renderer for Eidolon
 * Generates a unique creature SVG based on calculated metrics.
 */
export async function renderCreatureSVG(creatureData) {
    const {
        form,
        primaryColor,
        secondaryColor,
        complexity,
        auraIntensity,
        mutationIndex,
        appendageCount,
        geometryVariation,
        seed
    } = creatureData;

    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Helper for seed-based jitter
    const jitter = (val, scale) => val + (Math.random() - 0.5) * scale;

    // We'll use a local PRNG for rendering details if needed, 
    // but the parameters are already seeded.

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs>
        <radialGradient id="auraGradient">
            <stop offset="0%" stop-color="${primaryColor}" stop-opacity="${0.2 + auraIntensity * 0.4}" />
            <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0" />
        </radialGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>

    <!-- Aura Layer -->
    <circle cx="${centerX}" cy="${centerY}" r="${100 + auraIntensity * 50}" fill="url(#auraGradient)">
        <animate attributeName="r" values="${100 + auraIntensity * 50};${110 + auraIntensity * 60};${100 + auraIntensity * 50}" dur="4s" repeatCount="indefinite" />
    </circle>
`;

    // Appendages
    for (let i = 0; i < appendageCount; i++) {
        const angle = (i / appendageCount) * Math.PI * 2 + (geometryVariation * Math.PI);
        const length = 60 + complexity * 40;
        const x2 = centerX + Math.cos(angle) * length;
        const y2 = centerY + Math.sin(angle) * length;

        svg += `    <line x1="${centerX}" y1="${centerY}" x2="${x2}" y2="${y2}" stroke="${secondaryColor}" stroke-width="${2 + mutationIndex * 5}" stroke-linecap="round" opacity="0.8" />\n`;

        // Minor nodes at ends
        svg += `    <circle cx="${x2}" cy="${y2}" r="${3 + complexity * 5}" fill="${secondaryColor}" filter="url(#glow)" />\n`;
    }

    // Core Structure based on Stage
    let coreShape = '';
    if (form === 'egg') {
        coreShape = `<ellipse cx="${centerX}" cy="${centerY}" rx="40" ry="55" fill="${primaryColor}" stroke="white" stroke-width="2" />`;
    } else if (form === 'awakened') {
        coreShape = `<rect x="${centerX - 35}" y="${centerY - 35}" width="70" height="70" rx="15" fill="${primaryColor}" transform="rotate(${geometryVariation * 360} ${centerX} ${centerY})" />`;
    } else if (form === 'ascendant') {
        const points = [];
        const sides = 5 + Math.floor(complexity * 5);
        for (let j = 0; j < sides; j++) {
            const a = (j / sides) * Math.PI * 2;
            const r = 50 + geometryVariation * 10;
            points.push(`${centerX + Math.cos(a) * r},${centerY + Math.sin(a) * r}`);
        }
        coreShape = `<polygon points="${points.join(' ')}" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="2" />`;
    } else { // Transcendent
        svg += `    <circle cx="${centerX}" cy="${centerY}" r="60" fill="none" stroke="${primaryColor}" stroke-width="4" stroke-dasharray="10 5">
            <animateTransform attributeName="transform" type="rotate" from="0 ${centerX} ${centerY}" to="360 ${centerX} ${centerY}" dur="10s" repeatCount="indefinite" />
        </circle>`;
        coreShape = `<circle cx="${centerX}" cy="${centerY}" r="45" fill="${primaryColor}" filter="url(#glow)" />`;
    }

    svg += `    <!-- Core Structure -->\n    ${coreShape}\n`;

    // Mutation Accents
    if (mutationIndex > 0.5) {
        svg += `    <circle cx="${centerX - 15}" cy="${centerY - 10}" r="5" fill="white" opacity="0.6" />\n`;
        svg += `    <circle cx="${centerX + 15}" cy="${centerY - 10}" r="5" fill="white" opacity="0.6" />\n`;
    }

    svg += `</svg>`;

    const publicDir = path.join(process.cwd(), 'public');
    const outputPath = path.join(publicDir, 'creature.svg');

    // Ensure public dir exists
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(outputPath, svg);

    console.log(`SVG Renderer: Creature SVG saved to ${outputPath}`);
    return svg;
}
