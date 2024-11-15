import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";
import {
  onAuthStateChanged,
  User as UserFirebase,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../configs/firebaseConfig";
import { Href, router, useSegments } from "expo-router";
import { getUsuarioById } from "@/api/user";
import { Usuario } from "@/types";

const AuthContext = createContext<{
  signOut: () => void;
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  isLoading: boolean;
  setisLoading: (value: boolean) => void;
}>({
  signOut: () => null,
  user: null,
  setUser: () => {},
  isLoading: false,
  setisLoading: () => null,
});

// This hook can be used to access the user info.
export const useSession = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
};

export const loginWithFirebase = async (
  email: string,
  password: string
): Promise<Usuario | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("userCredential: ", userCredential);
    console.log("User signed in:", user);
    const usuario = getUsuarioById(db, user.uid);
    console.log("usuario: ", usuario);
    return usuario;
    // Manejo del inicio de sesión exitoso
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Error during login: [${errorCode}] ${errorMessage}`);
    // Manejo del error
    return null;
  }
};

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setisLoading] = useState(false);

  const segments = useSegments();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        setUser(null);
      } else {
        const usuario = await getUsuarioById(db, currentUser.uid);
        // buscar la primer ruta removiendo (app) para redirigir dependiendo del login
        const route = segments.filter((item) => !item.includes("(app)"))[0];
        // TODO: buscar la main page basado en el user permisions
        const mainPage = "ventas";
        const page = "/" + (!route || route === "login" ? mainPage : route);
        setUser(usuario);
        router.replace(page as Href<string>);
      }

      // Si hay un usuario, se establece, si no, es null
      //setLoading(false); // Deja de cargar una vez que se obtiene el estado del auth
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signOut: () => {
          signOut(auth);
        },
        user,
        setUser,
        isLoading,
        setisLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
