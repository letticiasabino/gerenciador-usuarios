import { Navigate, Route, Routes } from "react-router";

import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TooltipProvider } from "./components/ui/tooltip";
import { Calendario } from "./pages/Calendario";
import { Configuracoes } from "./pages/Configuracoes";
import { Dashboard } from "./pages/Dashboard";
import { Historico } from "./pages/Historico";
import { Login } from "./pages/Login";
import { Perfil } from "./pages/Perfil";

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  );
}

export default App;
