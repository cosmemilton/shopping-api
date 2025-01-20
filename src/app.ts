import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { createExpressServer, Action } from 'routing-controllers';
import { AuthController } from './controllers/authController';
import { UserController } from './controllers/userController';
import { CategoryController } from './controllers/categoryController';
import { ProductController } from './controllers/productController';
import { ClientController } from './controllers/clientController';
import { HttpErrorHandler } from './middlewares/httpErrorHandler';
import { Utils } from './utils';

const PORT = process.env.PORT || 3000;

const app = createExpressServer({
    routePrefix: '/api',
    cors: true,
    defaultErrorHandler: false,
    middlewares: [
        HttpErrorHandler
    ],
    controllers: [
        AuthController,
        UserController,
        CategoryController,
        ProductController,
        ClientController,
    ],
    authorizationChecker: async (action: Action, roles: string[]) => {
        const token = action.request.headers['authorization'];
        if (roles.length === 0) return false
        if (roles[0] === 'user'){
            const userLogin = Utils.decodeJWT(token) as { id: string };
            const prisma = new PrismaClient();
            const user = await prisma.user.findUnique({
                where: {
                    id: userLogin.id
                }
            });
            return !!user;
        }
        if (roles[0] === 'client'){
            const client = Utils.decodeJWT(token) as { role: string };
            return (client.role === 'client');
        } 
    
        return false;
    },
    currentUserChecker: async (action: Action) => {
        const token = action.request.headers['authorization'];
        return Utils.decodeJWT(token);
    },
    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});