import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
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
        console.error("Erro ao capturar informações de sessão:", sessionError);
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
      const result = await signInWithPopup(auth, provider);

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

      return result;
    } catch (error) {
      throw error;
    }
  };

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

  // Buscar perfil do usuário
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
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
            console.error("Erro ao converter timestamp:", error);
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
      console.error("Erro ao buscar perfil do usuário:", error);
      return null;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
