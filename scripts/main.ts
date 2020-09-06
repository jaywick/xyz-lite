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

const IS_DEV = process.env.NODE_ENV === 'development'

;(async () => {
    const folder = IS_DEV ? 'examples' : 'doc'

    if (IS_DEV) {
        console.warn('Running in dev mode')
    }

    const docs = await collectAllDocs(folder)
    await buildFolderStructure(docs)

    await Promise.allSettled([
        await Promise.allSettled([
            createHtml(docs),
            createIndexes(docs),
            copyPublicFiles(await collectPublicFiles()),
            createRedirects(docs),
        ]),
        await resizeImages(folder, await collectAllImages(folder)),
    ])

    IS_DEV && startDevServer()
})()
