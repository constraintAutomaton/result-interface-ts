import { expect } from "vitest";
import { toBeError, toBeResult } from "./matchers";

expect.extend({ toBeResult, toBeError });

interface ResultMatchers<R = unknown> {
    /** Assert the value is an ok Result; with an argument, also deep-equals the ok value. */
    toBeResult(expected?: unknown): R;
    /** Assert the value is an error Result; with an argument, also deep-equals the error. */
    toBeError(expected?: unknown): R;
}

declare module "vitest" {
    interface Assertion<T> extends ResultMatchers<T> {}
    interface AsymmetricMatchersContaining extends ResultMatchers {}
}
