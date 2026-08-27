import { isError, isResult, type Result } from "../index";

/**
 * The subset of a matcher's `this` context these matchers rely on. Vitest, Jest and Bun all
 * provide `equals` for deep structural comparison.
 */
export interface MatcherContext {
    equals(a: unknown, b: unknown): boolean;
}

/** What a matcher returns. Shared shape across Vitest, Jest and Bun. */
export interface MatcherResult {
    pass: boolean;
    message: () => string;
}

/** Assert the value is an ok `Result`; with an argument, also deep-equals the ok value. */
export function toBeResult(
    this: MatcherContext,
    received: Result<unknown, unknown>,
    ...expected: unknown[]
): MatcherResult {
    if (!isResult(received)) {
        return {
            pass: false,
            message: () => `expected an ok result, got error: ${stringify(received.error)}`
        };
    }
    if (expected.length === 0) {
        return { pass: true, message: () => "expected the value not to be an ok result" };
    }
    return {
        pass: this.equals(received.value, expected[0]),
        message: () =>
            `ok value mismatch\nexpected: ${stringify(expected[0])}\nreceived: ${stringify(received.value)}`
    };
}

/** Assert the value is an error `Result`; with an argument, also deep-equals the error. */
export function toBeError(
    this: MatcherContext,
    received: Result<unknown, unknown>,
    ...expected: unknown[]
): MatcherResult {
    if (!isError(received)) {
        return {
            pass: false,
            message: () => `expected an error result, got value: ${stringify(received.value)}`
        };
    }
    if (expected.length === 0) {
        return { pass: true, message: () => "expected the value not to be an error result" };
    }
    return {
        pass: this.equals(received.error, expected[0]),
        message: () =>
            `error mismatch\nexpected: ${stringify(expected[0])}\nreceived: ${stringify(received.error)}`
    };
}

function stringify(value: unknown): string {
    return typeof value === "string" ? value : JSON.stringify(value);
}
