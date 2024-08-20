export default function(node, parent, ctx) {
    const { name, extends: _extends, implements: _implements, body } = node

    let results = []

    results.push(`class ${ctx.$(name)}`)

    if (_extends) {
        results.push(`extends ${ctx.$(_extends, parent)}`)
    }

    if (_implements) {
        results.push(`implements ${_implements.map((i) => ctx.$(i, node)).join(', ')}`)
    }

    results = [results.join(' ')]

    results.push(...ctx.block(ctx.$$(node)))

    return ctx.make(...results)
}