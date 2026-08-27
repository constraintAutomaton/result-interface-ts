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
 * A Chai plugin adding `.result` and `.resultError` assertions.
 */
export function resultInterfaceChai(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
    chai.Assertion.addMethod("result", function (this: Chai.AssertionStatic, ...expected: unknown[]) {
        const self = this as unknown as ResultAssertion;
        const res = self._obj as Result<unknown, unknown>;
        const isValue = isResult(res);
        self.assert(
            isValue && (expected.length === 0 || utils.eql(res.value, expected[0])),
            expected.length === 0
                ? "expected #{this} to be a successful result"
                : "expected the value to equal #{exp}",
            expected.length === 0
                ? "expected #{this} not to be a successful result"
                : "expected the value not to equal #{exp}",
            expected[0],
            isValue ? res.value : undefined
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
            /** Assert the value is a successful Result; with an argument, also deep-equals the value. */
            result(expected?: unknown): Assertion;
            /** Assert the value is an error Result; with an argument, also deep-equals the error. */
            resultError(expected?: unknown): Assertion;
        }
    }
}
