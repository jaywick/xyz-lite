import Jimp from 'jimp'
import paths from 'path'

export const resizeImages = async (images: string[]): Promise<void> => {
    let count = 0

    for await (const path of images) {
        const outputfolder = paths.dirname(path.replace(/\/doc\//i, '/dist/'))

        const results = await Promise.allSettled([
            resize(path, outputfolder, [1440, 1440]),
            resize(path, outputfolder, [1440, 800]),
            resize(path, outputfolder, [800, 320], '-thumb'),
            resize(path, outputfolder, [5, 5], '-micro'),
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
