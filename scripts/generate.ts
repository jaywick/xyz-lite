import { promises as fs } from 'fs'
import paths from 'path'
import { getFilesRecursive, changeExtension } from './util/files'
import { renderIndex, renderPage, renderHome } from './util/render'
import express from 'express'
import matter from 'gray-matter'
import { transform } from './util/md'

const config = {
    // docsFolderName: 'examples',
    docsFolderName: 'doc',
    publicFolderName: 'public',
    outputFolderName: 'dist',
}

async function main() {
    const DOC_FOLDER = paths.join(__dirname, '..', config.docsFolderName)
    const PUBLIC_FOLDER = paths.join(__dirname, '..', config.publicFolderName)

    const docs = getFilesRecursive(DOC_FOLDER)
    const publics = getFilesRecursive(PUBLIC_FOLDER)

    const index: IMeta[] = []
    await transformDocs(docs, index)
    await copyPublicFiles(publics)
    await createIndexes(index)

    if (process.env.NODE_ENV === 'development') {
        serveDist()
    }
}

async function transformDocs(files: AsyncIterable<string>, index: IMeta[]) {
    for await (let path of files) {
        const newPath = path.replace(
            new RegExp('\\/' + config.docsFolderName + '\\/', 'i'),
            `/${config.outputFolderName}/`
        )

        // create parent directories
        await fs.mkdir(paths.join(newPath, '..'), { recursive: true })

        if (newPath.endsWith('.md') || newPath.endsWith('.mdx')) {
            // transform to html
            const markdown = String(await fs.readFile(path))
            const { content, data: frontmatter } = matter(markdown)
            const html = transform(content)

            const articleId = paths.basename(paths.dirname(path))
            const slug = frontmatter.slug || slugify(frontmatter.title)

            if (!slug) {
                console.warn('No slug found for ' + newPath)
            }

            const newFile = paths.join(
                paths.dirname(newPath),
                slug,
                'index.html'
            )

            await fs.mkdir(paths.join(newFile, '..'), { recursive: true })

            const meta: IMeta = {
                title: frontmatter.title,
                date: frontmatter.date,
                slug: frontmatter.slug,
                hero: '../' + frontmatter.hero,
                tag: frontmatter.tag,
                author: 'Jay Wick',
                readableDate: readableDate(frontmatter.date),
                readTime: readTime(content),
                url: `/blog/${articleId}/${frontmatter.slug}`,
                id: articleId,
            }

            await fs.writeFile(newFile, renderPage(html, meta), {
                flag: 'w',
            })

            index.push(meta)
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
            `/${config.outputFolderName}/`
        )

        // create parent directories
        await fs.mkdir(paths.join(outpath, '..'), { recursive: true })

        await fs.copyFile(path, outpath)
    }
}

function serveDist() {
    const app = express()
    app.use(
        express.static(paths.join(__dirname, '..', config.outputFolderName))
    )

    app.listen(3000)
    console.log('Started dev server @ http://127.0.0.1:3000/')
}

async function createIndexes(metas: IMeta[]) {
    const blogsPath = paths.join(config.outputFolderName, 'blog', 'index.html')
    await fs.writeFile(blogsPath, renderIndex(metas), {
        flag: 'w',
    })

    const homePath = paths.join(config.outputFolderName, 'index.html')
    await fs.writeFile(homePath, renderHome(metas), {
        flag: 'w',
    })
}

const READ_SPEED = 250 // wpm
const IMAGE_SPEED = 5 / 60 // 5s per image

function readTime(content: string) {
    const words = content.match(/[\w-]+/g)?.length ?? 0
    const images = content.match(/\!\[.+?\]\(.+?\)/g)?.length ?? 0
    const value = Math.ceil(words / READ_SPEED + images * IMAGE_SPEED)

    return `${value} min read`
}

function readableDate(value: string) {
    return new Date(Date.parse(value)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const slugify = (string: string) => {
    return string
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

main()
