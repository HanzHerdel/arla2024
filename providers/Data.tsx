import React, { createContext, useState, useEffect, useContext } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../configs/firebaseConfig"; // Asegúrate de importar tu configuración de Firebase
import { Repuestos } from "@/types";

interface FirestoreContextType {
  repuestos: Repuestos[]; // Aquí almacenaremos los artículos
  loading: boolean; // Para indicar si estamos cargando los datos
  /*  getRepuestos: () => Promise<void>; */ // Función para obtener los artículos
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(
  undefined
);

const FirestoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [repuestos, setRepuestos] = useState<Repuestos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /*   const getRepuestos = async () => {
    setLoading(true);
    try {
      const fetchedArticles = await fetchRepuestos(db);

      console.log("fetchedArticles: ", fetchedArticles);
      setRepuestos(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles: ", error);
    } finally {
      setLoading(false);
    }
  }; */

  return (
    <FirestoreContext.Provider
      value={{ repuestos, loading /* getRepuestos */ }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};

const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirestoreProvider");
  }
  return context;
};

export { FirestoreProvider, useFirestore };
