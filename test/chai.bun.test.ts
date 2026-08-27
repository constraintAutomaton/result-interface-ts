import { describe, it } from "bun:test";
import * as chai from "chai";
import { resultInterfaceChai } from "../src/testing/chai";
import { error, result } from "../src/index";

chai.use(resultInterfaceChai);
const { expect } = chai;

describe("chai result matchers", () => {
    it("result passes for successful values", () => {
        expect(result(42)).to.be.result();
        expect(result(42)).to.be.result(42);
        expect(error("x")).to.not.be.result();
    });

    it("resultError passes for error values", () => {
        expect(error("boom")).to.be.resultError("boom");
        expect(result(1)).to.not.be.resultError();
    });
});
