import {
    collectAllDocs,
    buildFolderStructure,
    collectAllImages,
    copyPublicFiles,
    collectPublicFiles,
    // createRedirects,
} from './util/files'
import { createHtml, createIndexes } from './util/transform'
import { resizeImages } from './util/images'
import { startDevServer } from './util/server'
;(async () => {
    const docs = await collectAllDocs()
    await buildFolderStructure(docs)

    await Promise.allSettled([
        await Promise.allSettled([
            createHtml(docs),
            createIndexes(docs),
            copyPublicFiles(await collectPublicFiles()),
            // createRedirects(docs),
        ]),
        await resizeImages(await collectAllImages()),
    ])

    process.env.NODE_ENV === 'development' && startDevServer()
})()
