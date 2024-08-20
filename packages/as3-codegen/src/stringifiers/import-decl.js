export default function(node, parent, ctx) {
    const { package: pkg, specifier, wildcard } = node;

    if (wildcard) {
        if (specifier) {
            throw new Error('Wildcard import cannot have a specifier');
        }

        return `import ${ctx.$(pkg, node)}.*;`;
    }

    return `import ${ctx.$(pkg, node)}.${ctx.$(specifier, node)};`;
}