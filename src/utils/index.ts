import * as crypto from 'crypto';
import type { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export class Utils {
    static generateMD5(input: string): string {
        return crypto.createHash('md5').update(input).digest('hex');
    }

    static generateJWt(user: {id:string,username:string,name: string, email:string, role: 'client' | 'user' }): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.sign({ 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            name: user.name
        }, secret, {
            expiresIn: '12h'
        });
    }

    static verifyJWT(token: string): string | object {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.verify(token, secret);
    }

    static decodeJWT(token: string): string | object {
        const decoded = jwt.decode(token);
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }

        return decoded;
    }

    static generateUUID(): string {
        return crypto.randomUUID().toString()
    }
    
    static removeNonNumeric(input: string): string {
        return input.replace(/\D/g, '');
    }

    static generateRandom12DigitNumber(): string {
        const randomNumber = Math.floor(Math.random() * 1e12).toString();
        return randomNumber.padStart(12, '0');
    }

    static formatMoneySitef(input: number): string {
        const formatted = input.toFixed(2);
        return formatted.replace(/\D/g, '');
    }
}