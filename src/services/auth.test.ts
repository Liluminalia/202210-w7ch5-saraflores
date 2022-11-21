import { debug } from 'console';
import { createToken, readToken } from './auth';
import jwt from 'jsonwebtoken';

const mock = { userName: 'pepe' };
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
