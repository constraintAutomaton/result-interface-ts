/**
 * A result that may fail.
 * 
 * @template V - The type of the successful result.
 * @template E - The type of the error in case of failure.
 */
export type Result<V, E = Error> = IResult<V> | IError<E>;

/**
 * A promise that SHOULD always resolves, returning a `Result<V, E>` to indicate either success or failure.
 * 
 * This type ensures that the promise will not reject. Instead, it will resolve with an object of type 
 * `Result<V, E>`, where:
 * - `value`: the successful result of type `V`
 * - `error`: an error of type `E` in case of failure
 *
 * @template V - The type of the successful result.
 * @template E - The type of the error in case of failure.
 */
export type SafePromise<V, E = Error> = Promise<Result<V, E>>;

/**
 * A successful result
 * @template V - The type of the successful result.
 */
export interface IResult<V> {
    value: V
}

/**
 * A failed result
 * @template E - The type of the error. Defaults to `Error`.
 */
export interface IError<E = Error> {
    error: E
}

export function isResult<V, E>(result: Result<V, E>): result is IResult<V> {
    return "value" in result;
}

export function isError<V, E>(result: Result<V, E>): result is IError<E> {
    return "error" in result;
}

/**
 * Create an IResult
 * @param {V} value 
 * @returns {IResult<V>} 
 */
export function createResult<V>(value: V): IResult<V> {
    return {
        value
    };
}

/**
 * create a IError
 * @param {E} error 
 * @returns {IError<E>}
 */
export function createError<E>(error: E): IError<E> {
    return {
        error
    };
}

/**
 * Converts a promise that may throw an error into a promise that always resolves, either with the result or an error.
 * 
 * This utility ensures that the returned promise never rejects. Instead, it will resolve with the result if successful, 
 * or with an error object if the original promise throws an error.
 *
 * @param {Promise<V>} promise - The promise to be transformed.
 * @returns {SafePromise<V, unknown>} A promise that resolves with the value if successful, or an Error if it fails.
 */

export async function createSafePromise<V>(promise: Promise<V>): SafePromise<V, unknown> {
    try {
        const value = await promise;
        return {
            value
        };
    } catch (e: unknown) {
        return {
            error: e
        };
    }

}

/**
 * Ensures that a `SafePromise` is safe by catching any potential error and resolving it with the provided error value.
 * If the promise is rejected and no error is provided, an `unknown` error will be used.
 * 
 * @param {SafePromise<V, E>} promise - The promise to ensure.
 * @param {E} [error] - The error to return if the promise is rejected. This parameter is optional.
 * @returns {SafePromise<V, E | unknown>}
 */
export async function ensureSafePromise<V, E>(promise: SafePromise<V, E>, error?: E): SafePromise<V, E | unknown> {
    try {
        const value = await promise;
        return value;
    } catch (e: unknown) {
        if (error !== undefined) {
            return { error };
        }
        return {
            error: e
        };
    }
}