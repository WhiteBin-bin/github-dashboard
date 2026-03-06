const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const REST_HEADERS = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

export async function githubRest(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: REST_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub REST API error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function githubGraphql(query, variables = {}) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    throw new Error(
      `GitHub GraphQL error: ${JSON.stringify(json.errors || json)}`
    );
  }

  return json.data;
}

export function getGithubUsername() {
  if (!GITHUB_USERNAME) {
    throw new Error("GITHUB_USERNAME is not set");
  }
  return GITHUB_USERNAME;
}