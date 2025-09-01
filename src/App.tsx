import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useResizeObserver } from "./hooks/useResizeObserver";

// Componentes
import Login from "./components/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Funcionarios from "./components/funcionarios";
import Veiculos from "./components/veiculos/Veiculos";
import Rotas from "./components/rotas/Rotas";
import Folgas from "./components/folgas/Folgas";
import Cidades from "./components/cidades";

import Vendedores from "./components/vendedores";
import Relatorios from "./components/relatorios/Relatorios";
import Configuracoes from "./components/configuracoes/Configuracoes";

// Páginas de erro
import { NotFoundPage, ServerErrorPage } from "./components/common/ErrorPages";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ResizeObserverErrorBoundary } from "./components/common/ErrorBoundary/ResizeObserverErrorBoundary";
import ErrorTestPage from "./components/common/ErrorPages/ErrorTestPage";

// Context
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

const App: React.FC = () => {
  // Aplicar o hook de ResizeObserver globalmente para suprimir erros
  useResizeObserver();

  return (
    <ErrorBoundary>
      <ResizeObserverErrorBoundary>
        <AuthProvider>
          <NotificationProvider>
            <Router
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <div className="App">
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                  }}
                />

                <Routes>
                  <Route path="/login" element={<Login />} />

                  {/* Rotas de erro */}
                  <Route path="/error/500" element={<ServerErrorPage />} />
                  <Route path="/error/404" element={<NotFoundPage />} />
                  <Route path="/error-test" element={<ErrorTestPage />} />

                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="funcionarios" element={<Funcionarios />} />
                    {/* Compatibilidade com rota antiga */}
                    <Route
                      path="motoristas"
                      element={<Navigate to="/funcionarios" />}
                    />
                    <Route path="veiculos" element={<Veiculos />} />
                    <Route path="rotas" element={<Rotas />} />
                    <Route path="folgas" element={<Folgas />} />
                    <Route path="cidades" element={<Cidades />} />

                    <Route path="vendedores" element={<Vendedores />} />
                    <Route path="relatorios" element={<Relatorios />} />
                    <Route path="configuracoes" element={<Configuracoes />} />
                  </Route>

                  {/* Rota catch-all para 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ResizeObserverErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;
