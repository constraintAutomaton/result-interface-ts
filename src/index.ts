// the [] on the Generic are to avoid the distribution of type
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
/**
 * A result that may fail.
 * 
 * If the `E` template is `never` the `Result` can only be a `IResult<V>`.
 * @template V - The type of the successful result.
 * @template E - The type of the error in case of failure.
 */
export type Result<V, E = Error> = [E] extends [never] ? Exclude<PureResult<V, E>, IError<E>> : PureResult<V, E>;

// A `Result` without the the conditional typing.
// This type only exist has a hack for the type guard. 
type PureResult<V, E> = IResult<V> | IError<E>;

/**
 * A promise that always resolves, returning a `Result<V, E>` to indicate either success or failure.
 * 
 * This type ensures that the promise will not reject. Instead, it will resolve with an object of type 
 * `Result<V, E>`, where:
 * - `value`: the successful result of type `V`
 * - `error`: an error of type `E` in case of failure
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

// `PureResult` is used because `E` extend any and if E is `never` then we could not be returning a `IError<E>`
export function isError<V, E>(result: PureResult<V, E>): result is IError<E> {
    return "error" in result;
}

/**
 * Create an IResult
 * @param {V} value 
 * @returns {IResult<V>} 
 */
export function result<V>(value: V = undefined as V): IResult<V> {
    return {
        value
    };
}

/**
 * create a IError
 * @param {E} error 
 * @returns {IError<E>}
 */
export function error<E>(error: E = undefined as E): IError<E> {
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
export async function safePromise<V>(promise: Promise<V>): SafePromise<V, unknown> {
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
