export default function(node, parent, ctx) {
    const { name, modifiers, signature, constructor } = node

    if (!ctx.is(parent, 'ClassDeclaration')) {
        throw new Error('MethodDeclaration must be a child of ClassDeclaration')
    }

    if (constructor) {
        if (parent.name.name !== name.name) {
            throw new Error('Constructor name must match class name')
        }

        if (signature.returns) {
            throw new Error('Constructor cannot have a return type')
        }

        if (modifiers) {
            if (modifiers.find((m) => m.name === 'static')) {
                throw new Error('Constructor cannot be static')
            }
        }
    } else {
        if (name.name === parent.name.name) {
            throw new Error('Method name cannot match class name')
        }

        if (!signature.returns) {
            throw new Error('MethodDeclaration must have a return type')
        }
    }

    let results = []

    if (modifiers) {
        results.push(...node.modifiers.map((m) => ctx.$(m)))
    }

    const params = signature.parameters.map((p) => `${ctx.$(p.name)}:${ctx.$(p.type)}`)
    const rt = signature.returns ? `:${ctx.$(signature.returns)}` : ''

    results.push(`function ${ctx.$(name)}(${params.join(', ')})${rt}`)

    results = [results.join(' ')]

    results.push(...ctx.block(ctx.$$(node)))

    return ctx.make(...results)
}