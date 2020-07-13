import { promises as fs } from 'fs'
import paths from 'path'
import { getFilesRecursive, changeExtension } from './util/files'
import { render } from './util/render'
import express from 'express'

const config = {
    docsFolderName: 'examples',
    publicFolderName: 'public',
}

async function main() {
    const DOC_FOLDER = paths.join(__dirname, '..', config.docsFolderName)
    const PUBLIC_FOLDER = paths.join(__dirname, '..', config.publicFolderName)

    const docs = getFilesRecursive(DOC_FOLDER)
    const publics = getFilesRecursive(PUBLIC_FOLDER)

    await transformDocs(docs)
    await copyPublicFiles(publics)

    serveDist()
}

async function transformDocs(files: AsyncIterable<string>) {
    for await (let path of files) {
        const newPath = path.replace(
            new RegExp('\\/' + config.docsFolderName + '\\/', 'i'),
            '/dist/'
        )

        // create parent directories
        await fs.mkdir(paths.join(newPath, '..'), { recursive: true })

        if (newPath.endsWith('.md')) {
            // transform to html
            const markdown = String(await fs.readFile(path))

            const newFile = changeExtension(newPath, 'html')
            await fs.writeFile(newFile, render(markdown), {
                flag: 'w',
            })
        } else {
            // copy file verbatim
            await fs.copyFile(path, newPath)
        }
    }
}

async function copyPublicFiles(files: AsyncIterable<string>) {
    for await (let path of files) {
        const outpath = path.replace(
            new RegExp('\\/' + config.publicFolderName + '\\/', 'i'),
            '/dist/'
        )

        // create parent directories
        await fs.mkdir(paths.join(outpath, '..'), { recursive: true })

        await fs.copyFile(path, outpath)
    }
}

function serveDist() {
    const app = express()
    app.use(express.static(paths.join(__dirname, '..', 'dist')))

    if (process.env.NODE_ENV === 'development') {
        app.listen(3000)
        console.log('Started dev server @ http://127.0.0.1:3000/')
    } else {
        app.listen(80)
        console.log('Started prod server on port 80')
    }
}

main()
