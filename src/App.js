import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Componentes
import Login from "./components/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Funcionarios from "./components/funcionarios";
import Veiculos from "./components/veiculos/Veiculos";
import Rotas from "./components/rotas/Rotas";
import Folgas from "./components/folgas/Folgas";
import Cidades from "./components/cidades";
import CidadesTestePage from "./components/cidades/pages/CidadesTestePage";
import Vendedores from "./components/vendedores";
import Relatorios from "./components/relatorios/Relatorios";
import Configuracoes from "./components/configuracoes/Configuracoes";

// Context
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
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
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
              />

              <Route
                path="/"
                element={user ? <Layout /> : <Navigate to="/login" />}
              >
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
                <Route path="cidades-teste" element={<CidadesTestePage />} />
                <Route path="vendedores" element={<Vendedores />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
