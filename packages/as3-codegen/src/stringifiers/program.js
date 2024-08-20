export default function(node, parent, ctx) {
    const { kind, namespace } = node;

    const supported = ['package', /*'namespace'*/];

    if (!supported.includes(kind)) {
        throw new Error('Cannot compile unknown node `' + node.kind + '`')
    }

    const r = [kind];

    if (namespace) {
        r.push(ctx.$(namespace, node));
    }

    return ctx.make(
        r.join(' '),
        ...ctx.block(ctx.$$(node))
    );
}