import fs from 'fs/promises';
import path from 'path';
import { createPRNG, hashString } from './seededRandom.js';

const TYPE_COLORS = {
    'Arcane': { primary: '#8B5CF6', secondary: '#C4B5FD' }, // Purple
    'Volt': { primary: '#F59E0B', secondary: '#FDE68A' },   // Orange/Yellow
    'Lumina': { primary: '#10B981', secondary: '#A7F3D0' }, // Green
    'Iron': { primary: '#4B5563', secondary: '#D1D5DB' },   // Gray
    'Aether': { primary: '#3B82F6', secondary: '#BFDBFE' }, // Blue
    'Draconis': { primary: '#EF4444', secondary: '#FECACA' }, // Red
    'Ember': { primary: '#F97316', secondary: '#FFEDD5' },  // Orange
    'Frost': { primary: '#06B6D4', secondary: '#CFFAFE' },   // Cyan
    'Neutral': { primary: '#6B7280', secondary: '#E5E7EB' }
};

export async function evolveCreature() {
    const dataDir = path.join(process.cwd(), 'data');
    const statsPath = path.join(dataDir, 'stats.json');
    const creaturePath = path.join(dataDir, 'creature.json');

    try {
        const statsData = await fs.readFile(statsPath, 'utf-8');
        const stats = JSON.parse(statsData);

        const rng = createPRNG(stats.username);

        // Morphological parameters calculation
        const form = stats.stage.toLowerCase();

        // Complexity based on level (normalized or scaled)
        // Level 0-100+ range. Let's cap at 50 for max complexity visual impact.
        const complexity = Math.min(stats.level / 50, 1.0);

        // Aura intensity based on EXP progress to next level
        // Level = floor(sqrt(EXP)), so Progress = EXP - level^2
        // Next Level EXP = (level + 1)^2
        const currentLevelExp = Math.pow(stats.level, 2);
        const nextLevelExp = Math.pow(stats.level + 1, 2);
        const expInRange = stats.exp - currentLevelExp;
        const rangeNeeded = nextLevelExp - currentLevelExp;
        const auraIntensity = rangeNeeded > 0 ? expInRange / rangeNeeded : 0;

        // Mutation index influenced by secondary type and seed
        const secondaryWeight = stats.secondaryType ? 0.3 : 0;
        const mutationIndex = (rng() * 0.7) + secondaryWeight;

        // Appendage count: base based on stage + seed variation
        let baseAppendages = 0;
        if (form === 'awakened') baseAppendages = 2;
        if (form === 'ascendant') baseAppendages = 4;
        if (form === 'transcendent') baseAppendages = 6;
        const appendageCount = baseAppendages + Math.floor(rng() * 3);

        // Geometry variation based on seed
        const geometryVariation = rng();

        // Colors
        const pColor = TYPE_COLORS[stats.primaryType] || TYPE_COLORS['Neutral'];
        const sColor = TYPE_COLORS[stats.secondaryType] || pColor;

        const creature = {
            username: stats.username,
            form,
            primaryType: stats.primaryType,
            secondaryType: stats.secondaryType,
            complexity,
            auraIntensity,
            mutationIndex,
            appendageCount,
            geometryVariation,
            primaryColor: pColor.primary,
            secondaryColor: sColor.secondary,
            seed: hashString(stats.username).toString(16),
            updatedAt: new Date().toISOString()
        };

        await fs.writeFile(creaturePath, JSON.stringify(creature, null, 2));
        console.log(`Evolution Engine: Created creature.json for ${stats.username}`);
        return creature;
    } catch (err) {
        console.error('Evolution Engine Error:', err);
        throw err;
    }
}
