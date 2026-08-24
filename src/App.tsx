import { StatsProvider } from "./context/StatsContext";
import { DifficultyProvider } from "./context/DifficultyContext";
import { useRoute } from "./routes/useRoute";
import { Header } from "./components/layout/Header";
import { QuizPage } from "./pages/QuizPage/QuizPage";
import { LibraryPage } from "./pages/LibraryPage/LibraryPage";

function App() {
  const { path, navigate } = useRoute();

  return (
    <DifficultyProvider>
      <StatsProvider>
        <Header currentRoute={path} onNavigate={navigate} />
        {path === "/" && <QuizPage />}
        {path === "/library" && <LibraryPage />}
      </StatsProvider>
    </DifficultyProvider>
  );
}

export default App;
