import {
    collectAllDocs,
    buildFolderStructure,
    collectAllImages,
    copyPublicFiles,
    collectPublicFiles,
} from './util/files'
import { createHtml, createIndexes } from './util/transform'
import { resizeImages } from './util/images'
import { startDevServer } from './util/server'
import { createRedirects } from './util/redirects'
import { promptArgs } from './util/context'
;(async () => {
    const context = promptArgs()

    await collectAllDocs(context)
    await buildFolderStructure(context)

    await Promise.allSettled([
        await Promise.allSettled([
            createHtml(context),
            createIndexes(context),
            collectPublicFiles(context).then(() => copyPublicFiles(context)),
            createRedirects(context),
        ]),
        collectAllImages(context).then(() => resizeImages(context)),
    ])

    context.devServer && startDevServer()
})()
