export default function(node, parent, ctx) {
    const { kind, namespace } = node;

    const supported = ['package', 'namespace'];

    if (!supported.includes(node.kind)) {
        throw new Error('Cannot compile unknown node `' + node.kind + '`')
    }

    return ctx.make(
        `${kind} ${ctx.$(namespace, node)}`,
        ...ctx.block(ctx.$$(node))
    );
}