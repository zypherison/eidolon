import fetch from 'node-fetch';

export async function fetchAllRepos(username, token) {
  let repos = [];
  let page = 1;
  const per_page = 100;

  while (true) {
    const url = `https://api.github.com/users/${username}/repos?per_page=${per_page}&page=${page}&type=all`;
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `token ${token}` : undefined,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Eidolon-v0.1'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.length === 0) break;
    repos = repos.concat(data);
    page++;
  }

  return repos;
}

export async function fetchRepoLanguages(languagesUrl, token) {
  const response = await fetch(languagesUrl, {
    headers: {
      Authorization: token ? `token ${token}` : undefined,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Eidolon-v0.1'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchTotalCommits(username, repoName, token) {
  const url = `https://api.github.com/repos/${username}/${repoName}/commits?per_page=1&author=${username}`;
  const response = await fetch(url, {
    headers: {
      Authorization: token ? `token ${token}` : undefined,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Eidolon-v0.1'
    }
  });

  if (!response.ok) {
    // Some repos might be empty and return 409
    if (response.status === 409 || response.status === 404) return 0;
    throw new Error(`Failed to fetch commits for ${repoName}: ${response.statusText}`);
  }

  // Use the link header to find the total number of commits
  const linkHeader = response.headers.get('link');
  if (linkHeader) {
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  // If no link header, there might be only 1 page
  const data = await response.json();
  return data.length;
}
