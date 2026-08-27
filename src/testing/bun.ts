import { expect } from "bun:test";
import { toBeError, toBeResult } from "./matchers";

// Bun types a matcher's `received` as `unknown`; our matchers accept a `Result`, so bridge here.
expect.extend({ toBeResult, toBeError } as unknown as Parameters<typeof expect.extend>[0]);

declare module "bun:test" {
    interface Matchers<T> {
        /** Assert the value is an ok Result; with an argument, also deep-equals the ok value. */
        toBeResult(expected?: unknown): T;
        /** Assert the value is an error Result; with an argument, also deep-equals the error. */
        toBeError(expected?: unknown): T;
    }
    interface AsymmetricMatchers {
        toBeResult(expected?: unknown): unknown;
        toBeError(expected?: unknown): unknown;
    }
}
