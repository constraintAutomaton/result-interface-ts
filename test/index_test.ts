import { describe, expect, it } from 'bun:test';
import { IError, isError, isResult, IResult, createSafePromise, SafePromise, ensureSafePromise } from '../src/index';

describe(isError.name, () => {
    it("should return true given an error", () => {
        let result: IError<string> = {
            error: "foo"
        };
        expect(isError(result)).toBe(true);
    });

    it("should return false given a result", () => {
        let result: IResult<string> = {
            value: "foo"
        };
        expect(isError(result)).toBe(false);
    });
});

describe(isResult.name, () => {
    it("should return true given a result", () => {
        let result: IResult<string> = {
            value: "foo"
        };
        expect(isResult(result)).toBe(true);
    });

    it("should return false given an error", () => {
        let result: IError<string> = {
            error: "foo"
        };
        expect(isResult(result)).toBe(false);
    });
});

describe(createSafePromise.name, () => {
    it("should return an result given a promise that resolve", async () => {
        const promise: Promise<string> = new Promise(resolve => resolve("foo"));

        const safePromise: SafePromise<string, unknown> = createSafePromise(promise);

        expect(await safePromise).toStrictEqual({
            value: "foo"
        });
    });

    it("should return a result given a promise that reject", async () => {
        const promise: Promise<string> = new Promise((_resolve, reject) => reject("foo"));

        const safePromise: SafePromise<string, unknown> = createSafePromise(promise);

        expect(await safePromise).toStrictEqual({
            error: "foo"
        });
    });

    it("should return an result given a promise that resolve with a Result", async () => {
        const promise: Promise<IResult<string>> = new Promise(resolve => resolve({ value: "foo" }));

        const safePromise: SafePromise<IResult<string>, unknown> = createSafePromise(promise);

        expect(await safePromise).toStrictEqual({
            value: {
                value: "foo"
            }
        });
    });

    it("should return a result given a promise that reject a Result", async () => {
        const promise: Promise<string> = new Promise((_resolve, reject) => reject({ error: "foo" }));

        const safePromise: SafePromise<string, unknown> = createSafePromise(promise);

        expect(await safePromise).toStrictEqual({
            error: {
                error: "foo"
            }
        });
    });
});

describe(ensureSafePromise.name, ()=>{
    it("should return an result given a promise that resolve", async () => {
        const promise: SafePromise<string> = new Promise(resolve => resolve({value:"foo"}));

        const safePromise: SafePromise<string, Error|unknown> = ensureSafePromise(promise);

        expect(await safePromise).toStrictEqual({
            value: "foo"
        });
    });

    it("should return a result given a promise that reject", async () => {
        const promise: SafePromise<string> = new Promise((_resolve, reject) => reject("foo"));

        const safePromise: SafePromise<string, Error|unknown> = ensureSafePromise(promise);

        expect(await safePromise).toStrictEqual({
            error: "foo"
        });
    });

    it("should return a result given a promise that reject with a default error", async () => {
        const promise: SafePromise<string, string> = new Promise((_resolve, reject) => reject("foo"));

        const safePromise: SafePromise<string, string|unknown> = ensureSafePromise(promise, "bar");

        expect(await safePromise).toStrictEqual({
            error: "bar"
        });
    });
});