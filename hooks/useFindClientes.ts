import { useEffect, useState } from "react";
import { db } from "../configs/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { Clientes } from "@/types";
import useDebounce from "./useDebounce";

const useGetClientes = (nombre: string = "", nit: string | null = null) => {
  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const nombreSearch = useDebounce(nombre);
  const nitSearch = useDebounce(nit);

  useEffect(() => {
    const clientesCollection = collection(db, "clientes");

    // Crear la consulta inicial
    let q = query(clientesCollection, orderBy("nombre", "asc"), limit(32));

    if (nombre) {
      q = query(q, where("nombre", ">=", nombreSearch));
    }

    if (nit) {
      q = query(q, where("nit", "==", nombreSearch));
    }

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedClientes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Clientes[];

        setClientes(fetchedClientes);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching clientes: ", error);
        setError("Error fetching clientes");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Limpiar la suscripción al desmontar el componente
  }, [nombreSearch, nitSearch]);

  return clientes;
};

export default useGetClientes;
