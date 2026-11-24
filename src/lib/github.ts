import "server-only";
import type { Contributions } from "@/types/content";

const WEEKS = 53;

/** Deterministic placeholder pattern (the prototype's seeded generator). */
export function sampleContributions(): Contributions {
  let seed = 25;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const levels: number[] = [];
  for (let i = 0; i < WEEKS * 7; i++) {
    const day = i % 7;
    const wk = Math.floor(i / 7);
    let r = rnd() * (0.6 + 0.35 * Math.sin(wk / 6));
    if (day === 0 || day === 6) r *= 0.45;
    levels.push(r < 0.16 ? 0 : r < 0.3 ? 1 : r < 0.44 ? 2 : r < 0.58 ? 3 : 4);
  }
  return { levels, total: null, live: false };
}

const LEVEL: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type GqlResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: { contributionLevel: string }[] }[];
        };
      };
    } | null;
  };
};

/** Live calendar via GitHub GraphQL, cached for a day. Falls back to the sample. */
export async function getContributions(username: string | null): Promise<Contributions> {
  const token = process.env.GITHUB_TOKEN;
  if (!token || !username) return sampleContributions();

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar {
          totalContributions weeks { contributionDays { contributionLevel } } } } } }`,
        variables: { login: username },
      }),
      next: { revalidate: 60 * 60 * 24, tags: ["github"] },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const json = (await res.json()) as GqlResponse;
    const cal = json.data?.user?.contributionsCollection.contributionCalendar;
    if (!cal) throw new Error("GitHub user not found");

    // GitHub's first week can be partial: pad it so rows stay aligned to weekdays.
    const levels: number[] = [];
    cal.weeks.forEach((w, i) => {
      if (i === 0) for (let p = w.contributionDays.length; p < 7; p++) levels.push(-1);
      w.contributionDays.forEach((d) => levels.push(LEVEL[d.contributionLevel] ?? 0));
    });
    return { levels, total: cal.totalContributions, live: true };
  } catch (err) {
    console.error("[github] contributions fetch failed", err);
    return sampleContributions();
  }
}
