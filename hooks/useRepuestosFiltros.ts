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
import { Collections, CONECTORES } from "@/utils/constants";
import { Repuesto } from "@/types";

interface GetRepuestosVentas {
  nombre: string;
  marca?: string;
  linea?: string | null;
  estacion?: string | null;
  modelo?: string;
  limite?: number;
  proveedor?: string;
  ubicacion?: string;
}

const useRepuestos = ({
  marca,
  linea,
  nombre,
  estacion,
  modelo,
  proveedor,
  ubicacion,
  limite = 32,
}: GetRepuestosVentas) => {
  console.log("ubicacion: ", ubicacion);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const keyWords = nombre
      .split(" ")
      .filter((word) => !CONECTORES.includes(word));

    const repuestosCollection = collection(db, Collections.repuestos);

    const queryArray = [];
    marca && queryArray.push(where("marca", "==", marca));
    linea && queryArray.push(where("linea", "==", linea));
    proveedor && queryArray.push(where("proveedor", "==", proveedor));
    ubicacion && queryArray.push(where("ubicacion", "==", ubicacion));

    if (keyWords.length)
      queryArray.push(where("keyWords", "array-contains-any", keyWords));
    /*     else {
      queryArray.push(where("nombre", ">=", nombre));
    } */
    if (modelo) {
      queryArray.push(where("compatibilidadInicial", "<=", modelo));
      queryArray.push(where("compatibilidadFinal", ">=", modelo));
    }
    console.log("queryArray: ", queryArray);

    estacion && queryArray.push(where("estacion", "==", estacion));
    const repQuery = query(
      repuestosCollection,
      ...queryArray,
      orderBy("nombre", "asc"),
      limit(limite)
    );

    // Escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(
      repQuery,
      (snapshot) => {
        const fetchedRepuestos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Repuesto[];

        console.log("fetchedRepuestos: ", fetchedRepuestos);
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
  }, [marca, linea, nombre, modelo, ubicacion, proveedor]);

  return { repuestos, loading, error };
};

export default useRepuestos;
