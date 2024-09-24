export const prepare = (env: Record<string, any>): Record<string, string> => Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
        key,
        (typeof value === 'symbol')
            ? (value.description || '')
            : JSON.stringify(value)
    ])
)