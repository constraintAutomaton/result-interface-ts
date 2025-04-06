# safe-result

A tiny utility to standardize how you return and handle results that may succeed or fail inspired by go error handling.


## Installation

```bash
npm install safe-result
```

## Usage

```ts
import {type Result, isResult,  isError} from "safe-result";

// A value that might or might not exist
let VALUE: number | undefined = undefined;

type Result<T, E> = { value: T } | { error: E };

function getValue(): Result<number, string> {
    if (VALUE !== undefined) {
        return { value: VALUE };
    }
    return { error: "The value is undefined" };
}

const result = getValue();

if (isResult(result)) {
    console.log(`The value is ${result.value}`);
}

if (isError(result)) {
    console.log(`Unable to get the value because: ${result.error}`);
}
```

## License

This project is licensed under the [MIT License](./LICENSE). See the LICENSE file for more details.
