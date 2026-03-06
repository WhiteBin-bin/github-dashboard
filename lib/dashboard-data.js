import { githubGraphql, githubRest, getGithubUsername } from "./github";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getYearRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return {
    from: start.toISOString(),
    to: now.toISOString(),
    year: now.getFullYear(),
  };
}

function getLastNDaysRange(days = 30) {
  const now = new Date();
  const from = new Date();
  from.setDate(now.getDate() - days + 1);

  return {
    from: from.toISOString(),
    to: now.toISOString(),
  };
}

async function getContributionStats() {
  const username = getGithubUsername();
  const { from, to, year } = getYearRange();

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
          totalCommitContributions
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
            }
            contributions(first: 1) {
              totalCount
            }
          }
        }
      }
    }
  `;

  const data = await githubGraphql(query, { login: username, from, to });

  const collection = data.user.contributionsCollection;
  const weeks = collection.contributionCalendar.weeks;

  const allDays = weeks.flatMap((week) => week.contributionDays);

  const last30 = allDays.slice(-30).map((day) => ({
    label: new Date(day.date).getDate().toString(),
    value: day.contributionCount,
    date: day.date,
  }));

  const contributedRepoCount =
    collection.commitContributionsByRepository.filter(
      (repo) => repo.contributions.totalCount > 0
    ).length;

  return {
    year,
    commits: collection.totalCommitContributions,
    contributedTo: contributedRepoCount,
    graph: last30,
  };
}

async function getOwnedRepos() {
  const username = getGithubUsername();
  let page = 1;
  let repos = [];

  while (true) {
    const data = await githubRest(
      `/users/${username}/repos?per_page=100&page=${page}&type=owner&sort=updated`
    );

    repos = repos.concat(data);

    if (data.length < 100) break;
    page += 1;
  }

  return repos.filter((repo) => !repo.fork);
}

async function getTotalStars(repos) {
  return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
}

async function getSearchCount(query) {
  const data = await githubRest(`/search/issues?q=${encodeURIComponent(query)}&per_page=1`);
  return data.total_count || 0;
}

async function getPrAndIssueCounts() {
  const username = getGithubUsername();

  const prQuery = `type:pr author:${username}`;
  const issueQuery = `type:issue author:${username}`;

  const [prs, issues] = await Promise.all([
    getSearchCount(prQuery),
    getSearchCount(issueQuery),
  ]);

  return { prs, issues };
}

export async function getDashboardData() {
  const [contributionStats, repos, prIssueStats] = await Promise.all([
    getContributionStats(),
    getOwnedRepos(),
    getPrAndIssueCounts(),
  ]);

  const totalStars = await getTotalStars(repos);

  return {
    title: "Contribution Overview",
    period: "Last 30 days",
    year: contributionStats.year,
    commits: contributionStats.commits,
    prs: prIssueStats.prs,
    issues: prIssueStats.issues,
    contributedTo: contributionStats.contributedTo,
    totalStars,
    graph: contributionStats.graph,
  };
}