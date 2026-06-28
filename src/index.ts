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

    logger.info("connection to database successful");

    // Devuelve la conexin al pool para que pueda reutilizarse
    connection.release();

    //Levantar el servidor:
    app.listen(PORT, () => {
      logger.info(`Server running on port: ${PORT}`);
    });

  } catch (error) {

    logger.error(
      { error },
      "Error connecting to the database"
    );

    process.exit(1); //indica si termino por algun fallo
  }
}


main();