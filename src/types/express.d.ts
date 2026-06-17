// Extiende User de express/passport para incluir los datos del JWT después de validar el token

declare global {

  namespace Express {

    interface User {

      id: number;
      email: string;
      role: string;

    }

  }

}

export {};