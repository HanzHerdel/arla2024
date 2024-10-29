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

interface Repuesto {
  id: string;
  marca: string;
  linea: string;
  nombre: string;
  // Agrega otros campos relevantes para tu aplicación
}

const useRepuestos = (
  marca: string | null = null,
  linea: string | null = null,
  nombre: string = ""
) => {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const keyWord = nombre.split(" ", 1)[0];
    const repuestosCollection = collection(db, "repuestos");

    // Crear la consulta inicial
    let q = query(repuestosCollection, orderBy("nombre", "asc"), limit(32));

    if (marca && linea) {
      q = query(
        q,
        where("marca", "==", marca),
        where("linea", "==", linea),
        where("nombre", ">=", nombre)
      );
    } else if (marca) {
      q = query(q, where("marca", "==", marca), where("nombre", ">=", nombre));
    } else if (linea) {
      q = query(q, where("linea", "==", linea), where("nombre", ">=", nombre));
    } else {
      q = query(
        q,
        where("keyWords", "array-contains", keyWord),
        where("nombre", ">=", nombre)
      );
    }

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedRepuestos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Repuesto[];

        setRepuestos(fetchedRepuestos);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching repuestos: ", error);
        setError("Error fetching repuestos");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Limpiar la suscripción al desmontar el componente
  }, [marca, linea, nombre]);

  return { repuestos, loading, error };
};

export default useRepuestos;
