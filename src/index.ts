import "dotenv/config"
import { env } from "./config/env";
import app from "../app";
import { conexionDB } from "./config/db";
import { logger } from "./config/logger";

const PORT = env.PORT;


// Testear conexion a base de datos y luego levantar servidor:

async function main() {
  try {
    const connection = await conexionDB.getConnection();

    logger.info("Conectado a la base de datos con exito");

    // Devuelve la conexin al pool para que pueda reutilizarse
    connection.release();

    //Levantar el servidor:
    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en puerto: ${PORT}`);
    });

  } catch (error) {

    logger.error(
      { error },
      "Error al conectar con la base de datos"
    );

    process.exit(1); //indica si termino por algun fallo
  }
}


main();