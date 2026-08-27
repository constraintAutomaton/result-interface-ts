import { isError, isResult, type Result } from "../index";

/** The minimal surface of a Chai assertion these methods rely on. */
interface ResultAssertion {
    _obj: unknown;
    assert(
        expression: boolean,
        message: string,
        negatedMessage: string,
        expected?: unknown,
        actual?: unknown
    ): void;
}

/**
 * A Chai plugin adding `.result` and `.resultError` assertions. Register it with `chai.use`:
 *
 * ```ts
 * import * as chai from "chai";
 * import { resultInterfaceChai } from "result-interface/chai";
 * chai.use(resultInterfaceChai);
 *
 * expect(result(42)).to.be.result(42);
 * expect(error("boom")).to.be.resultError("boom");
 * ```
 */
export function resultInterfaceChai(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
    chai.Assertion.addMethod("result", function (this: Chai.AssertionStatic, ...expected: unknown[]) {
        const self = this as unknown as ResultAssertion;
        const res = self._obj as Result<unknown, unknown>;
        const ok = isResult(res);
        self.assert(
            ok && (expected.length === 0 || utils.eql(res.value, expected[0])),
            expected.length === 0
                ? "expected #{this} to be an ok result"
                : "expected the ok value to equal #{exp}",
            expected.length === 0
                ? "expected #{this} not to be an ok result"
                : "expected the ok value not to equal #{exp}",
            expected[0],
            ok ? res.value : undefined
        );
    });

    chai.Assertion.addMethod(
        "resultError",
        function (this: Chai.AssertionStatic, ...expected: unknown[]) {
            const self = this as unknown as ResultAssertion;
            const res = self._obj as Result<unknown, unknown>;
            const isErr = isError(res);
            self.assert(
                isErr && (expected.length === 0 || utils.eql(res.error, expected[0])),
                expected.length === 0
                    ? "expected #{this} to be an error result"
                    : "expected the error to equal #{exp}",
                expected.length === 0
                    ? "expected #{this} not to be an error result"
                    : "expected the error not to equal #{exp}",
                expected[0],
                isErr ? res.error : undefined
            );
        }
    );
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Chai {
        interface Assertion {
            /** Assert the value is an ok Result; with an argument, also deep-equals the ok value. */
            result(expected?: unknown): Assertion;
            /** Assert the value is an error Result; with an argument, also deep-equals the error. */
            resultError(expected?: unknown): Assertion;
        }
    }
}
