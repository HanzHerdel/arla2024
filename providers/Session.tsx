import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";
import { useStorageState } from "../useStorageState";
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { router } from "expo-router";

const AuthContext = createContext<{
  signOut: () => void;
  user?: User | null;
  isLoading: boolean;
  setisLoading: (value: boolean) => void;
}>({
  signOut: () => null,
  user: null,
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
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("userCredential: ", userCredential);
    console.log("User signed in:", user);
    return user;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("currentUser: ", currentUser);
      if (!currentUser) {
        router.replace("/login");
      } else {
        router.replace("/ventas");
      }
      setUser(currentUser); // Si hay un usuario, se establece, si no, es null
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
        isLoading,
        setisLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
