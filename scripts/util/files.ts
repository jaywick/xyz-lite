import { promises as fs } from 'fs'
import { promise as glob } from 'glob-promise'
import paths from 'path'
import { extractMeta } from './markdown'

export const collectAllDocs = async (): Promise<IDoc[]> => {
    const pattern = paths.resolve(`${__dirname}/../../doc/**/*.mdx`)
    const docPaths = await glob(pattern)

    const docs = await Promise.all(docPaths.map(extractMeta))

    console.info(`Found ${docs.length} files`)
    return docs
}

export const buildFolderStructure = async (metas: IDoc[]) => {
    await fs.rmdir(`${__dirname}/../../dist/`, { recursive: true })
    for await (const meta of metas) {
        await fs.mkdir(`${__dirname}/../../dist/blog/${meta.id}`, {
            recursive: true,
        })
    }

    console.info(`Created ${metas.length} folders`)
}

export const collectAllImages = async (): Promise<string[]> => {
    const pattern = paths.resolve(
        `${__dirname}/../../doc/**/*.@(png|jpgjpeg|gif)`
    )

    const images = await glob(pattern)

    console.info(`Found ${images.length} images`)
    return images
}

export const collectPublicFiles = async (): Promise<string[]> => {
    const pattern = paths.resolve(`${__dirname}/../../public/**/*`)

    const files = await glob(pattern)

    console.info(`Found ${files.length} public files`)
    return files
}

export const copyPublicFiles = async (files: string[]): Promise<void> => {
    for await (let path of files) {
        const newPath = path.replace(/\/public\//i, '/dist/')
        console.log(path, newPath)
        await fs.copyFile(path, newPath)
    }

    console.info(`Copied ${files.length} public files`)
}

export const createRedirects = () => {}
