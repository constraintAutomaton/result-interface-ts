import { expect } from "vitest";
import { toBeError, toBeResult } from "./matchers";

expect.extend({ toBeResult, toBeError });

interface ResultMatchers<R = unknown> {
    /** Assert the value is a successful Result; with an argument, also deep-equals the value. */
    toBeResult(expected?: unknown): R;
    /** Assert the value is an error Result; with an argument, also deep-equals the error. */
    toBeError(expected?: unknown): R;
}

declare module "vitest" {
    interface Assertion<T> extends ResultMatchers<T> {}
    interface AsymmetricMatchersContaining extends ResultMatchers {}
}

// Re-exported so this file is a module: its `declare module` augments, not replaces, vitest's types.
export { toBeError, toBeResult };
