import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import TutorPage from "./pages/Tutor";
import SolvePage from "./pages/Solve";
import FilesPage from "./pages/Files";
import QuizzesPage from "./pages/Quizzes";
import FlashcardsPage from "./pages/Flashcards";
import PlannerPage from "./pages/Planner";
import ProgressPage from "./pages/Progress";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherClasses from "./pages/TeacherClasses";
import SettingsPage from "./pages/Settings";
import AppShell from "./components/AppShell";
import NotFound from "./pages/NotFound";

function Protected({ children, teacher = false }: { children: React.ReactNode; teacher?: boolean }) {
  return <AppShell teacher={teacher}>{children}</AppShell>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/features" component={Home} />
      <Route path="/teachers" component={Home} />
      <Route path="/login" component={() => <AuthPage mode="login" />} />
      <Route path="/register" component={() => <AuthPage mode="register" />} />
      <Route path="/dashboard" component={() => <Protected><StudentDashboard /></Protected>} />
      <Route path="/learn" component={() => <Protected><StudentDashboard /></Protected>} />
      <Route path="/tutor" component={() => <Protected><TutorPage /></Protected>} />
      <Route path="/solve" component={() => <Protected><SolvePage /></Protected>} />
      <Route path="/files" component={() => <Protected><FilesPage /></Protected>} />
      <Route path="/quizzes" component={() => <Protected><QuizzesPage /></Protected>} />
      <Route path="/assignments" component={() => <Protected><StudentDashboard /></Protected>} />
      <Route path="/flashcards" component={() => <Protected><FlashcardsPage /></Protected>} />
      <Route path="/planner" component={() => <Protected><PlannerPage /></Protected>} />
      <Route path="/progress" component={() => <Protected><ProgressPage /></Protected>} />
      <Route path="/profile" component={() => <Protected><SettingsPage /></Protected>} />
      <Route path="/settings" component={() => <Protected><SettingsPage /></Protected>} />
      <Route path="/teacher" component={() => <Protected teacher><TeacherDashboard /></Protected>} />
      <Route path="/teacher/classes" component={() => <Protected teacher><TeacherClasses /></Protected>} />
      <Route path="/teacher/lessons" component={() => <Protected teacher><TeacherClasses /></Protected>} />
      <Route path="/teacher/quizzes" component={() => <Protected teacher><QuizzesPage teacher /></Protected>} />
      <Route path="/teacher/assignments" component={() => <Protected teacher><TeacherClasses /></Protected>} />
      <Route path="/teacher/students" component={() => <Protected teacher><TeacherClasses /></Protected>} />
      <Route path="/teacher/files" component={() => <Protected teacher><FilesPage teacher /></Protected>} />
      <Route path="/teacher/profile" component={() => <Protected teacher><SettingsPage /></Protected>} />
      <Route path="/teacher/settings" component={() => <Protected teacher><SettingsPage /></Protected>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-left" richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
