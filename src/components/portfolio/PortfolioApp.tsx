"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import type { Endorsement } from "@/content/portfolio";

const Splash = () => (
  <div style={{ minHeight: "100vh", background: "var(--navy)" }} />
);

// Both layouts measure the browser window, so they only run in the browser.
const Desktop = dynamic(() => import("./PortfolioDesktop"), {
  ssr: false,
  loading: Splash,
});
const Mobile = dynamic(() => import("./PortfolioMobile"), {
  ssr: false,
  loading: Splash,
});

const PHONE_QUERY = "(max-width: 899px)";

function subscribe() {
  const query = window.matchMedia(PHONE_QUERY);
  // The desktop scroll engine holds window-level listeners, so swap layouts with a clean load.
  const handle = () => window.location.reload();
  query.addEventListener("change", handle);
  return () => query.removeEventListener("change", handle);
}

export default function PortfolioApp({
  approved,
}: {
  approved: Endorsement[];
}) {
  const isPhone = useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => null
  );
  if (isPhone === null) return <Splash />;
  return isPhone ? (
    <Mobile approved={approved} />
  ) : (
    <Desktop approved={approved} />
  );
}
