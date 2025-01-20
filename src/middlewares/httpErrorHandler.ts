import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { StructError } from 'superstruct'

@Middleware({ type: 'after' })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {
        if (response.headersSent) {
            return next(error);
        }
        if (error instanceof HttpError) {
            response.status(error.httpCode).json({
                name: error.name,
                message: error.message
            });
        } else if (error instanceof Error) {
            response.status(500).json({
                name: error.name,
                message: error.message
            });
        } else if (error instanceof StructError ){
            response.status(400).json({
                name: 'ValidationError',
                message: error.message,
            });
        } else {
            response.status(500).json({
                name: 'UnknownError',
                message: 'Erro desconhecido'
            });
        }


        next(error);
    }
}