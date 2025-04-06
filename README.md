# result-interface

![npm version](https://img.shields.io/npm/v/result-interface)
![Unit Tests Status](https://img.shields.io/github/actions/workflow/status/constraintAutomaton/result-interface-ts/ci.yml?label=unit+test
)

A tiny utility to standardize how to handle results that may succeed or fail inspired by Go-style error handling.

## Installation

```bash
npm i result-interface
```

## Usage

```ts
import {type Result, isResult,  isError} from "result-interface";

let VALUE: number | undefined = undefined;

function getValue(): Result<number, string> {
    if (VALUE !== undefined) {
        return { value: VALUE };
    }
    return { error: "The value is undefined" };
}

let result = getValue();

if (isResult(result)) {
    console.log(`The value is ${result.value}`);
}

if (isError(result)) {
    console.log(`Unable to get the value because: ${result.error}`);
}

async function getValueUnsafeLater(): Promise<number>{
    return new Promise((resolve, reject)=>{
        if (VALUE !== undefined) {
        resolve({ value: VALUE });
        return;
        }
        reject({ error: "The value is undefined" });
    });
}

// Creates a promise that always resolves with a Result. 
// On failure, it resolves with an error instead of rejecting or throwing an error.
result: SafePromise<V, unknown> = await createSafePromise(getValueUnsafeLater());

if (isResult(result)) {
    console.log(`The value is ${result.value}`);
}

if (isError(result)) {
    console.log(`Unable to get the value because: ${result.error}`);
}

// We can use `SafePromise<V, E>` to indicate that a promise is expected 
// to always resolve with either a value or an error. However, TypeScript cannot guarantee 
// this behavior at runtime, thus, the promise can still potentially be rejected.
async function getValueLater(): SafePromise<number,string>{
    return new Promise((resolve, reject)=>{
        if (VALUE !== undefined) {
        resolve({ value: VALUE });
        return;
        }
        reject({ error: "The value is undefined" });
    });
}
// We can ensure the promise always resolves by using the `ensureSafePromise` function. 
// This function will return the provided error if the promise is rejected, or an `unknown` 
// error if no default error is provided.
result = await ensureSafePromise(getValueLater(), "default error if the safe promise was unsafe");

if (isResult(result)) {
    console.log(`The value is ${result.value}`);
}

if (isError(result)) {
    console.log(`Unable to get the value because: ${result.error}`);
}
```
## Test

```bash
bun test
```
## License

This project is licensed under the [MIT License](./LICENSE). See the LICENSE file for more details.
