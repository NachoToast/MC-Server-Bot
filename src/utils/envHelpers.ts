/**
 * Attempts to retrieve a string value from `process.env`
 *
 * @throws Throws an error if the value is undefined or empty.
 */
export function getStringOrThrow(key: string): string {
    const value = process.env[key];

    if (value === undefined || value.length === 0) {
        throw new Error(`Environment variable ${key} is not defined`);
    }

    return value;
}

/**
 * Attempts to parse a port number from `process.env
 *
 * @param transformFn Optional function to transform the value before parsing
 * is attempted.
 *
 * @throws Throws an error if the value is undefined, empty, not a number, or
 * out of range.
 */
export function getPortOrThrow(
    key: string,
    transformFn: (x: string) => string = (x) => x,
): number {
    const rawValue = transformFn(getStringOrThrow(key));

    const value = Number(rawValue);

    if (Number.isNaN(value)) {
        throw new Error(`${key} must be a number (got ${rawValue})`);
    }

    if (value < 0 || value > 65535) {
        throw new Error(`${key} must be between 0 and 65535 (got ${rawValue})`);
    }

    return value;
}

/**
 * Attempts to parse a boolean value from `process.env`
 *
 * @throws Throws an error if the value is undefined or not a literal "true" /
 * "false" value.
 */
export function getBoolOrThrow(key: string): boolean {
    const rawValue = getStringOrThrow(key);

    switch (rawValue) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            throw new Error(
                `${key} must be either true or false (got ${rawValue})`,
            );
    }
}
