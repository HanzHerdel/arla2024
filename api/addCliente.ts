import { Cliente } from "@/types";
import { Collections } from "@/utils/constants";
import { collection, Firestore, addDoc } from "firebase/firestore";

export const addCliente = async (
  db: Firestore,
  cliente: Omit<Cliente, "id">
) => {
  try {
    const clientesCollection = collection(db, Collections.clientes);
    const newClient = await addDoc(clientesCollection, cliente);
    return { id: newClient.id, ...cliente } as Cliente;
  } catch (error) {
    console.error("Error adding cliente: ", error);
    return false;
  }
};
