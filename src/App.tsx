import { useEffect, useState } from "react";
import { PageShell } from "./components/PageShell";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";
import { ExamPage } from "./pages/ExamPage";
import { MistakesPage } from "./pages/MistakesPage";
import { ResultsPage } from "./pages/ResultsPage";
import { hashForRoute, routeFromHash, type RouteKey } from "./routing";

export default function App() {
  const [route, setRoute] = useState<RouteKey>(() => routeFromHash(window.location.hash || "#/"));

  useEffect(() => {
    const handleHashChange = () => setRoute(routeFromHash(window.location.hash || "#/"));
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function navigate(nextRoute: RouteKey) {
    window.location.hash = hashForRoute(nextRoute);
    setRoute(nextRoute);
  }

  const page = {
    home: <HomePage onNavigate={navigate} />,
    practice: <PracticePage onNavigate={navigate} />,
    exam: <ExamPage onNavigate={navigate} />,
    mistakes: <MistakesPage />,
    results: <ResultsPage />,
  }[route];

  return (
    <PageShell route={route} onNavigate={navigate}>
      {page}
    </PageShell>
  );
}
