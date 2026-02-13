import fs from 'fs/promises';
import path from 'path';
import { fetchAllRepos, fetchRepoLanguages, fetchTotalCommits } from './github.js';
import { CONFIG } from './config.js';

async function updateStats() {
    const token = process.env.GITHUB_TOKEN;
    const username = CONFIG.username;

    console.log(`Fetching repositories for ${username}...`);
    const repos = await fetchAllRepos(username, token);
    console.log(`Found ${repos.length} repositories.`);

    let totalCommits = 0;
    const languageStats = {};

    for (const repo of repos) {
        console.log(`Processing repo: ${repo.name}...`);

        // Total commits
        const commits = await fetchTotalCommits(username, repo.name, token);
        totalCommits += commits;

        // Languages
        const languages = await fetchRepoLanguages(repo.languages_url, token);
        for (const [lang, bytes] of Object.entries(languages)) {
            languageStats[lang] = (languageStats[lang] || 0) + bytes;
        }
    }

    // Compute EXP and Level
    const totalRepos = repos.length;
    const exp = (totalCommits * 5) + (totalRepos * 15);
    const level = Math.floor(Math.sqrt(exp));

    // Determine Stage
    let stage = 'Egg';
    for (const s of CONFIG.stages) {
        if (level <= s.maxLevel) {
            stage = s.name;
            break;
        }
    }

    // Determine Types
    const totalBytes = Object.values(languageStats).reduce((a, b) => a + b, 0);
    const sortedLangs = Object.entries(languageStats)
        .sort(([, a], [, b]) => b - a)
        .map(([lang, bytes]) => ({
            name: lang,
            percentage: (bytes / totalBytes) * 100,
            type: CONFIG.languageMap[lang] || 'Neutral'
        }));

    let primaryType = 'Neutral';
    let secondaryType = null;

    if (sortedLangs.length > 0) {
        const top = sortedLangs[0];
        primaryType = top.type;

        if (top.percentage <= 60 && sortedLangs.length > 1) {
            const second = sortedLangs[1];
            if (Math.abs(top.percentage - second.percentage) <= 20) {
                secondaryType = second.type;
            }
        }
    }

    const stats = {
        username,
        primaryType,
        secondaryType,
        stage,
        level,
        exp,
        totalCommits,
        totalRepos,
        updatedAt: new Date().toISOString()
    };

    const dataDir = path.join(process.cwd(), 'data');
    await fs.writeFile(path.join(dataDir, 'stats.json'), JSON.stringify(stats, null, 2));
    console.log('Successfully updated stats.json');
}

updateStats().catch(err => {
    console.error('Error updating stats:', err);
    process.exit(1);
});
