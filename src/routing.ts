export type RouteKey = "home" | "practice" | "exam" | "mistakes" | "results";

const routeMap: Record<string, RouteKey> = {
  "#/": "home",
  "#/practice": "practice",
  "#/exam": "exam",
  "#/mistakes": "mistakes",
  "#/results": "results",
};

const hashMap: Record<RouteKey, string> = {
  home: "#/",
  practice: "#/practice",
  exam: "#/exam",
  mistakes: "#/mistakes",
  results: "#/results",
};

export function routeFromHash(hash: string): RouteKey {
  return routeMap[hash] ?? "home";
}

export function hashForRoute(route: RouteKey): string {
  return hashMap[route];
}
