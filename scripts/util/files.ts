import { promises as fs } from 'fs'
import { promise as glob } from 'glob-promise'
import paths from 'path'
import { extractMeta } from './markdown'
import { IContext } from './context'

export const collectAllDocs = async (context: IContext): Promise<void> => {
    const pattern = paths.resolve(
        `${__dirname}/../../${context.folder}/**/*.@(md|mdx)`
    )
    const docPaths = await glob(pattern)

    const docs = await Promise.all(docPaths.map(extractMeta))

    console.info(`Found ${docs.length} files`)
    context.docs = docs
}

export const buildFolderStructure = async ({ docs: metas }: IContext) => {
    await fs.rmdir(`${__dirname}/../../dist/`, { recursive: true })

    for await (const meta of metas) {
        await fs.mkdir(`${__dirname}/../../dist/blog/${meta.id}`, {
            recursive: true,
        })
    }

    console.info(`Created ${metas.length} folders`)
}

export const collectAllImages = async (context: IContext): Promise<void> => {
    const pattern = paths.resolve(
        `${__dirname}/../../${context.folder}/**/*.@(png|jpg|jpeg|gif)`
    )

    const images = await glob(pattern)

    console.info(`Found ${images.length} images`)
    context.images = images
}

export const collectPublicFiles = async (context: IContext): Promise<void> => {
    const pattern = paths.resolve(`${__dirname}/../../public/**/*`)

    const files = await glob(pattern)

    console.info(`Found ${files.length} public files`)
    context.publicFiles = files
}

export const copyPublicFiles = async ({
    publicFiles,
}: IContext): Promise<void> => {
    for await (let path of publicFiles) {
        const newPath = path.replace(/\/public\//i, '/dist/')
        await fs.copyFile(path, newPath)
    }

    console.info(`Copied ${publicFiles.length} public files`)
}
