export default function(node, parent, ctx) {
    const { expr, arguments: args } = node

    return [
        ctx.$(expr, parent),
        '(',
        args.map(arg => ctx.$(arg, node)).join(', '),
        ')',
    ].join('')
}