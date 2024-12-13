import { ReduxAction } from "@/store/store";
import { setTraslados } from "@/store/trasladosSlice";
import { Traslados, Venta } from "@/types";
import { Collections } from "@/utils/constants";
import {
  Firestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { Dispatch, UnknownAction } from "redux";

export const subscribeTraslados = (
  db: Firestore,
  dispatch: Dispatch
): (() => void) => {
  try {
    const collectionRef = collection(db, Collections.traslado);
    const trasladosQuery = query(collectionRef, orderBy("fechaInicio", "desc"));

    const unsubscribe = onSnapshot(trasladosQuery, async (snapshot) => {
      // First, map basic traslado data
      const traslados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Traslados[];

      // Fetch related venta for each traslado with ventaId
      const trasladadosWithVentas = await Promise.all(
        traslados.map(async (traslado) => {
          // If ventaId exists, fetch the related order
          if (traslado.ventaId) {
            try {
              const ventaRef = doc(db, "pedidos", traslado.ventaId);
              const ventaSnapshot = await getDoc(ventaRef);

              if (ventaSnapshot.exists()) {
                return {
                  ...traslado,
                  venta: {
                    ...(ventaSnapshot.data() as Venta),
                    id: ventaSnapshot.id,
                  },
                };
              }
            } catch (error) {
              console.error(
                `Error fetching venta for traslado ${traslado.id}:`,
                error
              );
            }
          }

          // Return original traslado if no ventaId or fetch fails
          return traslado;
        })
      );

      // Dispatch the updated data
      dispatch(setTraslados(trasladadosWithVentas));
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching traslados: ", error);
    throw new Error("Error fetching traslados");
  }
};
