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

export const useGenericSubscribe = <T>(
  db: Firestore,
  collectionName: string,
  _limit = 32,
  orderByProp?: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if db and collectionName are provided
    if (!db || !collectionName) {
      setError(new Error("Firestore database or collection name is missing"));
      setLoading(false);
      return;
    }

    try {
      const collectionRef = collection(db, collectionName);
      const queryCol = query(
        ...[
          collectionRef,
          limit(_limit),
          where("estado", "!=", VentaEstados.cobrado),
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
          console.error(`Error fetching data from ${collectionName}: `, error);
          setError(error);
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error(
        `Error setting up snapshot listener for ${collectionName}: `,
        error
      );
      setError(error instanceof Error ? error : new Error("Unknown error"));
      setLoading(false);
    }
  }, [db, collectionName, orderByProp]);

  return { data, loading, error };
};
