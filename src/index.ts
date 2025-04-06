export type Result<V, E = Error> = IValidResult<V> | IError<E>;

export interface IValidResult<V> {
    value: V
}

export interface IError<E = Error> {
    error: E
}

export function isResult<V, E>(result: Result<V, E>): result is IValidResult<V> {
    return "value" in result;
}

export function isError<V, E>(result: Result<V, E>): result is IError<E> {
    return "error" in result;
}