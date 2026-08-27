import { isError, isResult, type Result } from "../index";

/** The matcher context Vitest, Jest and Bun pass as `this` to a custom matcher. */
export interface MatcherContext {
    equals(a: unknown, b: unknown): boolean;
    utils: {
        printReceived(value: unknown): string;
        printExpected(value: unknown): string;
    };
}

/** What a matcher returns. Shared shape across Vitest, Jest and Bun. */
export interface MatcherResult {
    pass: boolean;
    message: () => string;
}

/** Assert the value is a successful `Result`; with an argument, also deep-equals the value. */
export function toBeResult(
    this: MatcherContext,
    received: Result<unknown, unknown>,
    ...expected: unknown[]
): MatcherResult {
    const { printReceived, printExpected } = this.utils;
    if (!isResult(received)) {
        return {
            pass: false,
            message: () => `expected a result, got error: ${printReceived(received.error)}`
        };
    }
    if (expected.length === 0) {
        return { pass: true, message: () => "expected the value not to be a successful result" };
    }
    return {
        pass: this.equals(received.value, expected[0]),
        message: () =>
            `result value mismatch\nexpected: ${printExpected(expected[0])}\nreceived: ${printReceived(received.value)}`
    };
}

/** Assert the value is an error, with an argument, also deep-equals the error. */
export function toBeError(
    this: MatcherContext,
    received: Result<unknown, unknown>,
    ...expected: unknown[]
): MatcherResult {
    const { printReceived, printExpected } = this.utils;
    if (!isError(received)) {
        return {
            pass: false,
            message: () => `expected an error result, got value: ${printReceived(received.value)}`
        };
    }
    if (expected.length === 0) {
        return { pass: true, message: () => "expected the value not to be an error result" };
    }
    return {
        pass: this.equals(received.error, expected[0]),
        message: () =>
            `error mismatch\nexpected: ${printExpected(expected[0])}\nreceived: ${printReceived(received.error)}`
    };
}
