import { useState, useEffect } from "react";
import {
  Firestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  where,
} from "firebase/firestore";
import { VentaEstados } from "@/types";
import { Collections } from "@/utils/constants";

export enum FiltrosPedidos {
  "noCobrado",
  "todos",
}

export const usePedidosSubscribe = <T>(
  db: Firestore,
  filtro: FiltrosPedidos = FiltrosPedidos.todos,
  _limit = 32,
  orderByProp?: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const collectionRef = collection(db, Collections.pedidos);
      const queryCol = query(
        ...[
          collectionRef,
          limit(_limit),
          ...(filtro === FiltrosPedidos.noCobrado
            ? [where("estado", "!=", VentaEstados.cobrado)]
            : []),
          ...(orderByProp ? [orderBy(orderByProp)] : []),
        ]
      );

      const unsubscribe = onSnapshot(
        queryCol,
        (snapshot) => {
          const fetchedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];

          setData(fetchedData);
          setLoading(false);
        },
        (error) => {
          console.error(
            `Error fetching data from ${Collections.pedidos}: `,
            error
          );
          setError(error);
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error(
        `Error setting up snapshot listener for ${Collections.pedidos}: `,
        error
      );
      setError(error instanceof Error ? error : new Error("Unknown error"));
      setLoading(false);
    }
  }, [db, orderByProp]);

  return { data, loading, error };
};
