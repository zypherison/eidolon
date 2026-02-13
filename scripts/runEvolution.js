import { evolveCreature } from '../engine/evolutionEngine.js';
import { renderCreatureSVG } from '../engine/svgRenderer.js';

async function run() {
    try {
        console.log('Starting evolution process...');
        const creature = await evolveCreature();
        await renderCreatureSVG(creature);
        console.log('Evolution complete.');
    } catch (err) {
        console.error('Evolution failed:', err);
        process.exit(1);
    }
}

run();
