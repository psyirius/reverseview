export default function(node, parent, ctx) {
    const { expression, property } = node;

    return `${ctx.$(expression, node)}.${ctx.$(property, node)}`;
}