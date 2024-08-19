import { generatorHandler, GeneratorConfig, GeneratorOptions } from '@prisma/generator-helper'

generatorHandler({
    onManifest: (config: GeneratorConfig) => {
        console.log('config:', config)
        return {
            defaultOutput: '../src/_gen/db/',
            prettyName: 'Prisma AS3 Generator',
            requiresGenerators: [],
        }
    },
    onGenerate: async (options: GeneratorOptions) => {
        console.log('options:', options)

        // TODO: impl

        const outputPath = options.generator.output.value
        const enums = options.dmmf.datamodel.enums
        const models = options.dmmf.datamodel.models

        if (models.length > 0) {

        }
    },
})