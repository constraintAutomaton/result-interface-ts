import { isError, SafePromise, type Result } from "./src/index";

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