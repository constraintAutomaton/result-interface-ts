import { type Result, type SafePromise, ensureSafePromise, isError } from "./src/index";

let VALUE: number | undefined = undefined;

// `SafePromise<V, E>` indicates that a promise is expected 
// to always resolve with either a value or an error. However, TypeScript cannot guarantee 
// this behavior at runtime, so the promise can still potentially be rejected.
async function getValueLater(): SafePromise<number, string> {
    return new Promise((resolve, reject) => {
        if (VALUE !== undefined) {
            resolve({ value: VALUE });
        } else {
            reject({ error: "The value is undefined" });
        }
    });
}

// We can ensure the promise always resolves by using the `ensureSafePromise` function. 
// This function will return the provided error if the promise is rejected, or an `unknown` 
// error if no default error is provided.
const resp: Result<number, string|unknown> = await ensureSafePromise(getValueLater(), "default error if the safe promise was unsafe");

if (isError(resp)) {
    console.log(`Unable to get the value. Reason: ${resp.error}`);
    process.exit(1);
}

console.log(`The value multiplied by two is ${resp.value * 2}`);
process.exit(0);