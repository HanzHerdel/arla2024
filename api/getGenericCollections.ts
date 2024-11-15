import { Repuesto } from "@/types";
import { CONECTORES } from "@/utils/constants";
import { AnyAction, Dispatch, UnknownAction } from "@reduxjs/toolkit";
import {
  collection,
  Firestore,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

interface ReduxAction<T> extends UnknownAction {
  type: string;
  payload: T[];
}

export const getCollectionData = async <T>(
  db: Firestore,
  collectionName: string,
  setValues?: (data: T[]) => void,
  orderByProp = "nombre"
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);

    const repQuery = query(collectionRef, orderBy(orderByProp, "asc"));

    // Obtener los documentos
    const snapshot = await getDocs(repQuery);
    const fetchedData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    if (setValues) {
      setValues(fetchedData);
    }

    return fetchedData;
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}: `, error);
    throw new Error(`Error fetching data from ${collectionName}`);
  }
};

export const subscribeDataForRedux = <T>(
  db: Firestore,
  collectionName: string,
  onDataUpdate: (data: T[]) => ReduxAction<T>,
  dispatch: Dispatch,
  orderByProp = "nombre"
): (() => void) => {
  try {
    const collectionRef = collection(db, collectionName);
    const repQuery = query(collectionRef, orderBy(orderByProp, "asc"));

    const unsubscribe = onSnapshot(repQuery, (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      dispatch(onDataUpdate(fetchedData));
    });

    return unsubscribe;
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}: `, error);
    throw new Error(`Error fetching data from ${collectionName}`);
  }
};
