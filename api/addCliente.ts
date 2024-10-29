import { Clientes } from "@/types";
import { collection, Firestore, addDoc } from "firebase/firestore";

export const addCliente = async (
  db: Firestore,
  cliente: Omit<Clientes, "id">
) => {
  try {
    const clientesCollection = collection(db, "clientes");
    const newClient = await addDoc(clientesCollection, cliente);
    console.log("newClient: ", newClient);

    return { id: newClient.id, ...cliente } as Clientes;
  } catch (error) {
    console.error("Error adding cliente: ", error);
    return false;
  }
};
