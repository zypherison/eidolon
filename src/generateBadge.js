import fs from 'fs/promises';
import path from 'path';

const TYPE_COLORS = {
    'Arcane': '#8a2be2',
    'Volt': '#ffd700',
    'Lumina': '#f0ffff',
    'Iron': '#708090',
    'Aether': '#00ffff',
    'Draconis': '#ff4500',
    'Ember': '#ff8c00',
    'Frost': '#add8e6',
    'Neutral': '#808080'
};

async function generateBadge() {
    const statsPath = path.join(process.cwd(), 'data', 'stats.json');
    const stats = JSON.parse(await fs.readFile(statsPath, 'utf-8'));

    const { level, primaryType, secondaryType, exp } = stats;
    const typeText = secondaryType ? `${primaryType}/${secondaryType}` : primaryType;
    const color = TYPE_COLORS[primaryType] || TYPE_COLORS['Neutral'];

    const label = `Eidolon Lv.${level}`;
    const value = `${typeText} | ${exp} EXP`;

    // Simple SVG calculation for widths
    const labelWidth = label.length * 7 + 10;
    const valueWidth = value.length * 7 + 10;
    const totalWidth = labelWidth + valueWidth;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="a">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#a)">
    <path fill="#555" d="M0 0h${labelWidth}v20H0z"/>
    <path fill="${color}" d="M${labelWidth} 0h${valueWidth}v20H${labelWidth}z"/>
    <path fill="url(#b)" d="M0 0h${totalWidth}v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`.trim();

    await fs.writeFile(path.join(process.cwd(), 'badge.svg'), svg);
    console.log('Successfully generated badge.svg');
}

generateBadge().catch(err => {
    console.error('Error generating badge:', err);
    process.exit(1);
});
