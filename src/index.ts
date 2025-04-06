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
export type SafePromise<V, E> = Promise<Result<V, E>>;

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
 * Converts a promise that may throw an error into a promise that always resolves, either with the result or an error.
 * 
 * This utility ensures that the returned promise never rejects. Instead, it will resolve with the result if successful, 
 * or with an error object if the original promise throws an error.
 *
 * @param {Promise<V>} promise - The promise to be transformed.
 * @returns {SafePromise<V, unknown>} A promise that resolves with the value if successful, or an Error if it fails.
 */

export async function createSafePromise<V>(promise: Promise<V>): SafePromise<V, unknown> {
    return new Promise(async (resolve) => {
        try {
            const value = await promise;
            resolve({
                value
            });
        } catch (e: unknown) {
            resolve({
                error: e
            });
        }

    });
}