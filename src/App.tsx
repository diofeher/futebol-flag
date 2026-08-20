import { StatsProvider } from "./context/StatsContext";
import { useRoute } from "./routes/useRoute";
import { Header } from "./components/layout/Header";
import { QuizPage } from "./pages/QuizPage/QuizPage";
import { LibraryPage } from "./pages/LibraryPage/LibraryPage";

function App() {
  const { path, navigate } = useRoute();

  return (
    <StatsProvider>
      <Header currentRoute={path} onNavigate={navigate} />
      {path === "/" && <QuizPage />}
      {path === "/library" && <LibraryPage />}
    </StatsProvider>
  );
}

export default App;
