export default function(node, parent, ctx) {
    const { name, typeName, default: defaultValue } = node

    return [
        ctx.$(name, node),
        ':',
        ctx.$(typeName, node),
        defaultValue ? ` = ${ctx.$(defaultValue, node)}` : '',
    ].join('')
}