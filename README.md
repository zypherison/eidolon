# 🌌 Eidolon

> **An evolving digital identity engine powered by your GitHub activity.**

Eidolon is a GitHub-native identity system that transforms your coding journey into a mythic evolution. By analyzing your repositories, commits, and language proficiency, it calculates experience (EXP), determines your power level, and evolves your digital persona through distinct mythic stages.

---

## 🚀 Live Status

![Eidolon Badge](badge.svg)

*This badge is automatically generated and updated daily to reflect the latest state of your Eidolon.*

---

## ✨ Features

- **Automated Evolution:** Powered by GitHub Actions, your Eidolon updates daily based on your latest activity.
- **DNA Analysis:** Analyzes your language distribution to assign primary and secondary mythic types.
- **Experience Engine:** Tracks total commits and repositories to calculate your level and evolution stage.
- **Dynamic Badge:** Generates a custom SVG badge that can be embedded in your GitHub profile.
- **Web Dashboard:** A sleek, static dashboard hosted on GitHub Pages for a deep dive into your stats.

---

## 🧬 Evolution Mechanics

### The EXP Formula
Your growth is determined by your tangible contributions:
`EXP = (total_commits * 5) + (total_repos * 15)`

### Level Progression
`Level = floor(sqrt(EXP))`

### Evolution Stages
| Level Range | Stage          | Description                                  |
| :---------- | :------------- | :------------------------------------------- |
| 0           | **Egg**        | The potential of a new identity.             |
| 1 – 10      | **Awakened**   | The first spark of digital consciousness.    |
| 11 – 25     | **Ascendant**  | Rising through the ranks of the code-sphere. |
| 26+         | **Transcendent**| A master of the digital realm.               |

---

## 💠 Mythic Types (Language DNA)

Eidolon maps your most used programming languages to mythic types:

| Language   | Type       | Language   | Type       |
| :--------- | :--------- | :--------- | :--------- |
| Python     | **Arcane** | Go         | **Aether** |
| JavaScript | **Volt**   | C++        | **Draconis**|
| TypeScript | **Lumina** | Java       | **Ember**  |
| Rust       | **Iron**   | C#         | **Frost**  |

**Type Rules:**
- **Single Type:** Assigned if one language covers >60% of your total bytes.
- **Dual Type:** Assigned if your top two languages are within 20% of each other.
- **Neutral:** Default type if no recognized languages are found.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 20
- **Logic:** JavaScript (ES Modules)
- **Automation:** GitHub Actions (Daily Cron)
- **API:** GitHub REST API v3
- **Presentation:** Static HTML/CSS (GitHub Pages)

---

## 🏗️ Architecture

Eidolon operates on a deterministic, stateless loop:

1. **Aggregation:** Fetches repository and commit data via the GitHub API.
2. **Evolution:** Processes raw data through the experience and type resolution engines.
3. **Synthesis:** Updates `data/stats.json` and generates a fresh `badge.svg`.
4. **Publication:** Commits changes automatically and serves the dashboard via GitHub Pages.

---

## ⚙️ Setup & Automation

### GitHub Actions
The system is designed to run entirely within the GitHub ecosystem.
- **Workflow:** `.github/workflows/update-eidolon.yml`
- **Secrets:** Requires a `GITHUB_TOKEN` with repository access.

### Local Development
To run the engine locally:

```bash
# Install dependencies
npm install

# Update stats and fetch GitHub data
npm run update

# Generate the mythic badge
npm run badge
```

---

## 🗺️ Roadmap (v0.1 MVP)
- [x] Core EXP & Level Engine
- [x] Language-to-Type Mapping
- [x] Automated GitHub Action Workflow
- [x] Dynamic SVG Badge Generation
- [x] Static Dashboard Implementation

---

Built with ❤️ by [Zypheris Labs](https://github.com/zypherison)
