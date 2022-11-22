import { debug } from 'console';
import {
    createToken,
    passwordComparer,
    passwordEncrypt,
    readToken,
} from './auth';
import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';

const mock = { userName: 'pepe', role: 'admin' };
describe('given createToken', () => {
    describe('when...', () => {
        test('then...', () => {
            const signSpy = jest.spyOn(jwt, 'sign');
            const r = createToken(mock);
            expect(typeof r).toBe('string');
            expect(signSpy).toHaveBeenCalled();
        });
    });
});
describe('given readToken', () => {
    describe('when token is valid', () => {
        const tokenMock = createToken(mock);
        debug(tokenMock);
        test('then...', () => {
            const r = readToken(tokenMock);
            expect(r.userName).toEqual(mock.userName);
        });
    });
    describe('when token is not valid', () => {
        const tokenMock =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InBlcGUiLCJpYXQiOjE2Njg3NzMxMzB9.RqJsFrOFnYmPoP2HxJXuWPZrAe-qSLvWoYjgHZpOENA';
        test('then...', () => {
            expect(() => {
                readToken(tokenMock);
            }).toThrow();
        });
    });
    describe('when token is not formated', () => {
        const tokenMock = 'hola, soy un token';
        test('then...', () => {
            expect(() => {
                readToken(tokenMock);
            }).toThrow();
        });
    });
});
describe('given passwordEncrypt', () => {
    describe('when...', () => {
        test('then...', async () => {
            const signSpy = await jest.spyOn(bc, 'hash');
            const r = await passwordEncrypt('pepe');
            expect(typeof r).toBe('string');
            expect(signSpy).toHaveBeenCalled();
        });
    });
});
describe('given passwordComparer', () => {
    describe('when...', () => {
        test('then...', async () => {
            const signSpy = await jest.spyOn(bc, 'compare');
            const encrypt = await passwordEncrypt('pepe');
            const r = await passwordComparer('pepe', encrypt);
            expect(r).toBe(true);
            expect(signSpy).toHaveBeenCalled();
        });
    });
});
