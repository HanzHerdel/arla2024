import { collection, getDocs, Query, query, where } from "firebase/firestore";

/**
 * obtiene documentos y les agrega el id
 * @param query
 * @param collectionName
 * @returns
 */
export const getQuery = async <T>(
  query: Query,
  collectionName?: string
): Promise<T[] | null> => {
  try {
    const snapshot = await getDocs(query);
    const fetchedData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
    return fetchedData;
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}: `, error);
    return null;
  }
};
