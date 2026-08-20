import { useState, useEffect, useCallback } from "react";

export type AppRoute = "/" | "/library";

function getRouteFromHash(): AppRoute {
  const hash = window.location.hash.slice(1) || "/";
  if (hash === "/library") return "/library";
  return "/";
}

export function useRoute() {
  const [path, setPath] = useState<AppRoute>(getRouteFromHash);

  useEffect(() => {
    const handler = () => setPath(getRouteFromHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((route: AppRoute) => {
    window.location.hash = route;
  }, []);

  return { path, navigate };
}
