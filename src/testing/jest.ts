import { expect } from "@jest/globals";
import { toBeError, toBeResult } from "./matchers";

expect.extend({ toBeResult, toBeError });

interface ResultMatchers<R = void> {
    /** Assert the value is a successful Result; with an argument, also deep-equals the value. */
    toBeResult(expected?: unknown): R;
    /** Assert the value is an error Result; with an argument, also deep-equals the error. */
    toBeError(expected?: unknown): R;
}

declare module "@jest/expect" {
    interface Matchers<R> extends ResultMatchers<R> {}
}

// Re-exported so this file is a module: its `declare module` augments, not replaces, Jest's types.
export { toBeError, toBeResult };
