import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import SessionService from "../services/sessionService";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  createdAt: Date;
  lastLogin: Date;
  provider: string;
  telefone?: string;
  cargo?: string;
  notificacoes?: {
    email: boolean;
    push: boolean;
    rotas: boolean;
    folgas: boolean;
    manutencao: boolean;
  };
  sessionInfo?: {
    ip: string;
    device: string;
    browser: string;
    os: string;
    userAgent: string;
    timestamp: Date;
  };
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string,
    role?: string,
  ) => Promise<UserCredential>;
  updateUserProfile: (
    uid: string,
    updates: Partial<UserProfile>,
  ) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Login com email/senha
  const login = async (
    email: string,
    password: string,
  ): Promise<UserCredential> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Capturar informações de sessão
      try {
        const sessionInfo = await SessionService.getSessionInfo();

        // Atualizar perfil com informações de sessão
        await setDoc(
          doc(db, "users", result.user.uid),
          {
            lastLogin: new Date(),
            sessionInfo: {
              ...sessionInfo,
              timestamp: new Date(),
            },
          },
          { merge: true },
        );
      } catch (sessionError) {
        // Continuar mesmo se falhar a captura de sessão
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Login com Google
  const loginWithGoogle = async (): Promise<UserCredential> => {
    try {
      const provider = new GoogleAuthProvider();

      // Configurar o provider para melhor compatibilidade
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Tentar popup primeiro (melhor UX), com fallback para redirect
      try {
        const result = await signInWithPopup(auth, provider);
        await processGoogleSignInResult(result);
        return result;
      } catch (popupError: any) {
        // Se o popup falhar por qualquer motivo relacionado a COOP, usar redirect
        if (
          popupError.code === "auth/popup-closed-by-user" ||
          popupError.message?.includes("Cross-Origin-Opener-Policy") ||
          popupError.message?.includes("window.closed") ||
          popupError.message?.includes("blocked") ||
          popupError.code === "auth/popup-blocked"
        ) {
          await signInWithRedirect(auth, provider);
          throw new Error("REDIRECT_INITIATED");
        }

        throw popupError;
      }
    } catch (error) {
      throw error;
    }
  };

  // Buscar perfil do usuário
  const fetchUserProfile = useCallback(
    async (uid: string): Promise<UserProfile | null> => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as DocumentData;

          // Função auxiliar para converter Timestamp para Date
          const convertTimestampToDate = (timestamp: any): Date => {
            if (!timestamp) return new Date();

            try {
              // Se é um Timestamp do Firestore
              if (timestamp && typeof timestamp.toDate === "function") {
                return timestamp.toDate();
              }

              // Se já é um Date
              if (timestamp instanceof Date) {
                return timestamp;
              }

              // Se é um timestamp numérico
              if (typeof timestamp === "number") {
                return new Date(timestamp);
              }

              // Se é uma string de data
              if (typeof timestamp === "string") {
                return new Date(timestamp);
              }

              return new Date();
            } catch (error) {
              return new Date();
            }
          };

          return {
            uid: data.uid,
            email: data.email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            role: data.role,
            createdAt: convertTimestampToDate(data.createdAt),
            lastLogin: convertTimestampToDate(data.lastLogin),
            provider: data.provider,
            telefone: data.telefone,
            cargo: data.cargo,
            notificacoes: data.notificacoes,
            sessionInfo: data.sessionInfo
              ? {
                  ...data.sessionInfo,
                  timestamp: convertTimestampToDate(data.sessionInfo.timestamp),
                }
              : undefined,
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    [],
  );

  // Função auxiliar para processar resultado do login Google
  const processGoogleSignInResult = useCallback(
    async (result: UserCredential) => {
      // Verificar se o usuário já existe no Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Criar novo usuário no Firestore
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: "user", // Role padrão
          createdAt: new Date(),
          lastLogin: new Date(),
          provider: "google",
        });
      } else {
        // Atualizar último login
        await setDoc(
          doc(db, "users", result.user.uid),
          {
            lastLogin: new Date(),
          },
          { merge: true },
        );
      }

      // Atualizar imediatamente o userProfile para evitar delay na interface
      const updatedProfile = await fetchUserProfile(result.user.uid);
      setUserProfile(updatedProfile);
    },
    [fetchUserProfile],
  );

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Criar usuário
  const signup = async (
    email: string,
    password: string,
    displayName: string,
    role: string = "user",
  ): Promise<UserCredential> => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Atualizar perfil
      await updateProfile(result.user, { displayName });

      // Criar documento do usuário no Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName,
        role,
        createdAt: new Date(),
        lastLogin: new Date(),
        provider: "email",
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (
    uid: string,
    updates: Partial<UserProfile>,
  ): Promise<void> => {
    try {
      await setDoc(doc(db, "users", uid), updates, { merge: true });
      const updatedProfile = await fetchUserProfile(uid);
      setUserProfile(updatedProfile);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // Verificar se há resultado de redirect pendente
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // Processar resultado do redirect
          await processGoogleSignInResult(result);
        }
      } catch (error) {
        console.error("Erro ao processar redirect result:", error);
        // Continuar mesmo se falhar o redirect result
      }
    };

    // Verificar redirect result primeiro
    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [processGoogleSignInResult, fetchUserProfile]);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    loginWithGoogle,
    logout,
    signup,
    updateUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
