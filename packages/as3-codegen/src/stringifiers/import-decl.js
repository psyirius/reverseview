export default function(node, parent, ctx) {
    return `import ${ctx.$(node.package)}.${ctx.$(node.specifier)};`;
}