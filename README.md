# result-interface

![npm version](https://img.shields.io/npm/v/result-interface)
![Unit Tests Status](https://img.shields.io/github/actions/workflow/status/constraintAutomaton/result-interface-ts/ci.yml?label=unit+test
)

A tiny utility (mainly interfaces) with zero dependencies to standardize handling results that may succeed or fail, inspired by Go-style error handling.

## Installation

```bash
npm i result-interface
```

## Usage

You can define functions more declaratively when working with possible failures:

```ts
import { type Result, isError } from "result-interface";

let VALUE: number | undefined = undefined;

function getValue(): Result<number, string> {
    if (VALUE !== undefined) {
        return { value: VALUE };
    }
    return { error: "The value is undefined" };
}

const resp: Result = getValue();

if (isError(resp)) {
    console.log(`Unable to get the value. Reason: ${resp.error}`);
    exit(1);
}

console.log(`The value multiplied by two is ${resp.value * 2}`);
exit(0);
```

You can ensure that a `Promise` will not throw:

```ts
import { type Result, isError } from "result-interface";

let VALUE: number | undefined = undefined;

async function getValueLaterUnsafe(): Promise<number> {
    return new Promise((resolve, reject) => {
        if (VALUE !== undefined) {
            resolve({ value: VALUE });
        } else {
            reject({ error: "The value is undefined" });
        }
    });
}

// Creates a promise that always resolves with a Result. 
// On failure, it resolves with an error instead of rejecting or throwing.
const resp: SafePromise<number, unknown> = await createSafePromise(getValueLaterUnsafe());

if (isError(resp)) {
    console.log(`Unable to get the value. Reason: ${resp.error}`);
    exit(1);
}

console.log(`The value multiplied by two is ${resp.value * 2}`);
exit(0);
```

You can ensure that SafePromises are actually safe:

```ts
import { type Result, isError } from "result-interface";

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
const resp: SafePromise<number, string> = await ensureSafePromise(getValueLater(), "default error if the safe promise was unsafe");

if (isError(resp)) {
    console.log(`Unable to get the value. Reason: ${resp.error}`);
    exit(1);
}

console.log(`The value multiplied by two is ${resp.value * 2}`);
exit(0);
```

## Test

```bash
bun test
```
## License

This project is licensed under the [MIT License](./LICENSE). See the LICENSE file for more details.
