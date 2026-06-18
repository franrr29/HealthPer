//Errores personalizados que extienten la clase Error de JavaScript:

export class AppError extends Error {

    public statusCode: number;


    constructor(message: string, statusCode: number) {

        super(message);

        this.statusCode = statusCode;

        // Mantiene la herencia correcta para poder usar instanceof apperror
        Object.setPrototypeOf(
            this,
            AppError.prototype
        );

    }

}