// TODO: fix the type of cb
export default function debounce<T extends (...args: any) => any>(cb: T, wait: number): T {
    let timeout: ReturnType<typeof setTimeout>;

    return (function () {
        const context = this;
        const args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(() => (cb as any).apply(context, args), wait);
    }) as T;
}