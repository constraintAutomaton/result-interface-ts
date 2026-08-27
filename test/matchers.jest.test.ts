import { describe, expect, it } from "@jest/globals";
import "../src/testing/jest";
import { error, result } from "../src/index";

describe("toBeResult", () => {
    it("passes for a successful result, with and without an expected value", () => {
        expect(result(42)).toBeResult();
        expect(result(42)).toBeResult(42);
        expect(result({ a: 1 })).toBeResult({ a: 1 });
        expect(error("x")).not.toBeResult();
    });

    it("fails for an error result", () => {
        expect(() => expect(error("x")).toBeResult()).toThrow();
    });

    it("fails on a value mismatch", () => {
        expect(() => expect(result(1)).toBeResult(2)).toThrow();
    });

    it("fails when negated on a successful result", () => {
        expect(() => expect(result(1)).not.toBeResult()).toThrow();
    });
});

describe("toBeError", () => {
    it("passes for an error result, with and without an expected error", () => {
        expect(error("boom")).toBeError();
        expect(error("boom")).toBeError("boom");
        expect(result(1)).not.toBeError();
    });

    it("fails for a successful result", () => {
        expect(() => expect(result(1)).toBeError()).toThrow();
    });

    it("fails on an error mismatch", () => {
        expect(() => expect(error("a")).toBeError("b")).toThrow();
    });

    it("fails when negated on an error result", () => {
        expect(() => expect(error("x")).not.toBeError()).toThrow();
    });
});
