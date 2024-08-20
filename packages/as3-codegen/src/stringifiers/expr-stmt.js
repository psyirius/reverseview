export default function(node, parent, ctx) {
    const { expr } = node

    return `${ctx.$(expr, node)};`
}