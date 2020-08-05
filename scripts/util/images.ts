import Jimp from 'jimp'
import {
    dirname as directoryPath,
    join as joinPath,
    extname as fileExtension,
    basename as removeFileExtension,
} from 'path'
import { existsSync as fileExists } from 'fs'
import report from 'yurnalist'

export const createResizedImages = async (
    file: string,
    outfile: string,
    overwrite: boolean
) => {
    const outputfolder = directoryPath(outfile)

    const [originalPath, thumbnailPath, microPath] = await Promise.all([
        resize(file, outputfolder, [1440, 1440], '', overwrite),
        resize(file, outputfolder, [1000, 320], '-thumb', overwrite),
        resize(file, outputfolder, [10, 10], '-micro', overwrite),
    ])
}

async function resize(
    filepath: string,
    outputfolder: string,
    [width, height]: [number, number],
    suffix = '',
    overwrite: boolean
) {
    const extension = fileExtension(filepath)
    const nameNoExt = removeFileExtension(filepath, extension)

    const newPath = joinPath(outputfolder, `${nameNoExt}${suffix}${extension}`)

    if (fileExists(newPath) && !overwrite) {
        return newPath
    }

    try {
        const image = await Jimp.read(filepath)
        await image.scaleToFit(width, height).quality(100).writeAsync(newPath)
    } catch (err) {
        report.error(`Failed to resize ${filepath}`)
    }

    return newPath
}
