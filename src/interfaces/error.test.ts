import { CustomError, HTTPError } from './error';

describe('Given the error', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(418, 'Tea Pot', 'froilan');
    });
    describe('when we call it', () => {
        test('then should throw an error', () => {
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
            expect(error).toHaveProperty('statusCode', 418);
            expect(error).toHaveProperty('statusMessage', 'Tea Pot');
            expect(error).toHaveProperty('message', 'froilan');
            expect(error).toHaveProperty('name', 'HTTPError');
        });
    });
});
