import {
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";
import { getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";

// Interface para el usuario base
interface UsuarioBase {
  nombre: string;
  email: string;
  // Agrega aquí otras propiedades requeridas del usuario
}

// Interface para el usuario con fecha
interface Usuario extends UsuarioBase {}

// Interface para la respuesta del servidor (ajusta según tu caso)
interface RespuestaCreacionUsuario {
  id: string;
  mensaje: string;
  // Agrega aquí otras propiedades que devuelve tu función cloud
}

export const crearUsuario = async (
  usuario: UsuarioBase
): Promise<RespuestaCreacionUsuario> => {
  // Crear una copia tipada del usuario con la fecha

  // Obtener instancia de Functions
  const functions = getFunctions();

  // Crear la función callable con tipo de retorno
  const crearUsuarioCallable = httpsCallable<Usuario, RespuestaCreacionUsuario>(
    functions,
    "creacionUsuario"
  );

  try {
    const result: HttpsCallableResult<RespuestaCreacionUsuario> =
      await crearUsuarioCallable(usuario);
    return result.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// Ejemplo de uso
/*
const nuevoUsuario: UsuarioBase = {
  nombre: "Juan Pérez",
  email: "juan@ejemplo.com"
};

try {
  const resultado = await crearUsuario(nuevoUsuario);
  console.log('Usuario creado:', resultado.id);
} catch (error) {
  console.error('Error:', error);
}
*/
