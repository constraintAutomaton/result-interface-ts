import { describe, expect, it } from 'bun:test';
import { type IError, isError, Result, isResult, type IResult, safePromise, type SafePromise, error, result, unwrap } from '../src/index';

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

describe(safePromise.name, () => {
    it("should return an result given a promise that resolve", async () => {
        const promise: Promise<string> = new Promise(resolve => resolve("foo"));

        const result: SafePromise<string, unknown> = safePromise(promise);

        expect(await result).toStrictEqual({
            value: "foo"
        });
    });

    it("should return a result given a promise that reject", async () => {
        const promise: Promise<string> = new Promise((_resolve, reject) => reject("foo"));

        const result: SafePromise<string, unknown> = safePromise(promise);

        expect(await result).toStrictEqual({
            error: "foo"
        });
    });

    it("should return an result given a promise that resolve with a Result", async () => {
        const promise: Promise<IResult<string>> = new Promise(resolve => resolve({ value: "foo" }));

        const result: SafePromise<IResult<string>, unknown> = safePromise(promise);

        expect(await result).toStrictEqual({
            value: {
                value: "foo"
            }
        });
    });

    it("should return a result given a promise that reject a Result", async () => {
        const promise: Promise<string> = new Promise((_resolve, reject) => reject({ error: "foo" }));

        const result: SafePromise<string, unknown> = safePromise(promise);

        expect(await result).toStrictEqual({
            error: {
                error: "foo"
            }
        });
    });
});

describe(error.name, () => {
    it("should create an error", () => {
        expect(error("foo")).toStrictEqual({ error: "foo" });
    });
});

describe(result.name, () => {
    it("should create a result", () => {
        expect(result("foo")).toStrictEqual({ value: "foo" });
    });
});

describe(unwrap.name, () => {
    it("should return a result", () => {
        const res: Result<string, number> = result("foo");
        expect(unwrap(res)).toBe("foo")
    });

    it("should return an error", () => {
        const res: Result<string, number> = error(3);
        expect(unwrap(res)).toBe(3)
    });
});