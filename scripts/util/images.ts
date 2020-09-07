import Jimp from 'jimp'
import paths from 'path'
import { IContext } from './context'
import { promises as fs } from 'fs'

export const resizeImages = async ({
    folder,
    images,
    skipImages,
}: IContext): Promise<void> => {
    let count = 0

    for await (const path of images) {
        const outputfolder = paths.dirname(
            path.replace(new RegExp(`\/${folder}\/`, 'i'), '/dist/')
        )

        if (skipImages) {
            fs.copyFile(path, paths.join(outputfolder, paths.basename(path)))
            continue
        }

        const results = await Promise.allSettled([
            resize(path, outputfolder, [320, 320], '-320w'),
            resize(path, outputfolder, [480, 480], '-480w'),
            resize(path, outputfolder, [768, 768], '-768w'),
            resize(path, outputfolder, [1024, 1024], '-1024w'),
            resize(path, outputfolder, [1200, 1200]),
        ])

        count += results.filter((x) => x.status === 'fulfilled').length
    }

    console.info(`Created ${count} resized images from ${images.length}`)
}

async function resize(
    filepath: string,
    outputfolder: string,
    [width, height]: [number, number],
    suffix = ''
): Promise<void> {
    const extension = paths.extname(filepath)
    const nameNoExt = paths.basename(filepath, extension)

    const newPath = paths.join(
        outputfolder,
        `${nameNoExt}${suffix}${extension}`
    )

    try {
        const image = await Jimp.read(filepath)
        await image.scaleToFit(width, height).quality(100).writeAsync(newPath)
    } catch (err) {
        console.error(`Failed to resize ${filepath}`)
        throw err
    }
}
