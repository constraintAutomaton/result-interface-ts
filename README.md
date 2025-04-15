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

const resp: Result<number, string> = getValue();

if (isError(resp)) {
    console.log(`Unable to get the value. Reason: ${resp.error}`);
    process.exit(1);
}

console.log(`The value multiplied by two is ${resp.value * 2}`);
```
You can specify that a `Promise will not throw`:

```ts
import { isError, SafePromise, type Result } from "result-interface";

let VALUE: number | undefined = undefined;

async function getValueLater(): SafePromise<number,string> {
    return new Promise((resolve, reject) => {
        if (VALUE !== undefined) {
            resolve({
                value:VALUE
            })
        } else {
            reject("The value is undefined");
        }
    });
}

// Creates a promise that always resolves with a Result. 
// On failure, it resolves with an error instead of rejecting or throwing.
const resp: Result<number, string> = await getValueLater();

if (isError(resp)) {
    console.log(`Unable to get the value. Reason: ${resp.error}`);
    process.exit(1);
}

console.log(`The value multiplied by two is ${resp.value * 2}`);
```

You can specify that a promise will never fail, thus that it will always be an `IResult`:
```ts
import { SafePromise, type Result } from "./src/index";

let VALUE: number | undefined = undefined;

async function getValueLater(): SafePromise<number, never> {
    return new Promise((resolve, reject) => {
        if (VALUE !== undefined) {
            resolve({
                value: VALUE
            })
        } else {
            reject("The value is undefined");
        }
    });
}

// Creates a promise that always resolves with a Result. 
// On failure, it resolves with an error instead of rejecting or throwing.
const resp: Result<number, never> = await getValueLater();

console.log(`The value multiplied by two is ${resp.value * 2}`);
```
You can ensure that a `Promise` will not throw:

```ts
import { isError, safePromise, type Result } from "result-interface";

let VALUE: number | undefined = undefined;

async function getValueLaterUnsafe(): Promise<number> {
    return new Promise((resolve, reject) => {
        if (VALUE !== undefined) {
            resolve(VALUE)
        } else {
            reject("The value is undefined");
        }
    });
}

// Creates a promise that always resolves with a Result. 
// On failure, it resolves with an error instead of rejecting or throwing.
const resp: Result<number, unknown> = await safePromise(getValueLaterUnsafe());

if (isError(resp)) {
    console.log(`Unable to get the value. Reason: ${resp.error}`);
    process.exit(1);
}

console.log(`The value multiplied by two is ${resp.value * 2}`);
```

You can use helper functions to generate `IError` and `IResult` types (the possible types of `Result`).

```ts
import { type Result, isError, result, error } from "result-interface";

function getValue(): Result<number, string> {
    if (VALUE !== undefined) {
        return result(Value);
    }
    return error("The value is undefined");
}
```

## Test

```bash
bun test
```
## License

This project is licensed under the [MIT License](./LICENSE). See the LICENSE file for more details.
