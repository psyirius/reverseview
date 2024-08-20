export default function(node, parent, ctx) {
    const { expr, arguments: args } = node

    return [
        ctx.$(expr, node),
        '(',
        args.map(arg => ctx.$(arg, node)).join(', '),
        ')',
    ].join('')
}