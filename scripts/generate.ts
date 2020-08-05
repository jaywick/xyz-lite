import { promises as fs } from 'fs'
import paths from 'path'
import { getFilesRecursive } from './util/files'
import { renderIndex, renderPage, renderHome } from './util/render'
import express from 'express'
import matter from 'gray-matter'
import { transform } from './util/md'
import { createResizedImages } from './util/images'
import report from 'yurnalist'

let failed = false
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

    const spinner = report.activity()

    spinner.tick('Transforming docs...')
    await transformDocs(docs, index).catch(report.error)
    report.success('Transformed docs')

    spinner.tick('Copying public files...')
    await copyPublicFiles(publics).catch(report.error)
    report.success('Public files copied')

    spinner.tick('Creating indexes...')
    await createIndexes(index).catch(report.error)
    report.success('Indexes created')

    spinner.end()

    if (failed) {
        throw new Error('Generation unsuccessful. Check the logs.')
    }

    if (process.env.NODE_ENV === 'development') {
        report.info('serving dev server')
        serveDist()
    }
}

const isMarkdownFile = (path: string) =>
    ['.md', '.mdx'].some(endsWithIgnoreCase(path))

const isImageFile = (path: string) =>
    ['.png', '.jpg', '.jpeg', '.gif'].some(endsWithIgnoreCase(path))

const endsWithIgnoreCase = (a: string) => (b: string) =>
    a.toLocaleLowerCase().endsWith(b.toLocaleLowerCase())

const mkDirRecursive = (path: string) => fs.mkdir(path, { recursive: true })

const replacePathComponent = (path: string, find: string, replace: string) =>
    path.replace(new RegExp('\\/' + find + '\\/', 'i'), `/${replace}/`)

const errorHandler = (...data: any[]) => (err: Error) => {
    report.error('Unhandled error occured with data:')
    report.inspect(data)
    report.inspect(err)
    failed = true
}

async function transformDocs(files: AsyncIterable<string>, index: IMeta[]) {
    for await (let path of files) {
        const newPath = replacePathComponent(
            path,
            config.docsFolderName,
            config.outputFolderName
        )

        await mkDirRecursive(paths.join(newPath, '..'))

        if (isMarkdownFile(newPath)) {
            await transformMarkdown(path, newPath, index).catch(
                errorHandler(path)
            )
        } else if (isImageFile(newPath)) {
            await createResizedImages(path, newPath, true).catch(
                errorHandler(path)
            )
        } else {
            report.warn(`Unexpected file extension will be ignored: ${path}`)
        }
    }
}

async function transformMarkdown(
    path: string,
    newPath: string,
    index: IMeta[]
) {
    const markdown = String(await fs.readFile(path))
    const { content, data: frontmatter } = matter(markdown)

    const html = transform(content)

    const articleId = paths.basename(paths.dirname(path))
    const slug = frontmatter.slug || slugify(frontmatter.title)

    if (!slug) {
        report.warn(`No slug found for ${newPath}`)
    }

    const newFile = paths.join(paths.dirname(newPath), slug, 'index.html')

    await mkDirRecursive(paths.join(newFile, '..'))

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

    const pageContent = renderPage(html, meta)
    await writeFile(newFile, pageContent)

    index.push(meta)
}

async function copyPublicFiles(files: AsyncIterable<string>) {
    for await (let path of files) {
        const outpath = replacePathComponent(
            path,
            config.publicFolderName,
            config.outputFolderName
        )

        await mkDirRecursive(paths.join(outpath, '..'))
        await fs.copyFile(path, outpath)
    }
}

function serveDist() {
    const app = express()
    app.use(
        express.static(paths.join(__dirname, '..', config.outputFolderName))
    )

    app.listen(3000)
    report.success('Started dev server @ http://127.0.0.1:3000/')
}

const writeFile = (path: string, content: string) =>
    fs.writeFile(path, content, { flag: 'w' })

async function createIndexes(metas: IMeta[]) {
    const blogsPath = paths.join(config.outputFolderName, 'blog', 'index.html')
    await writeFile(blogsPath, renderIndex(metas))

    const homePath = paths.join(config.outputFolderName, 'index.html')
    await writeFile(homePath, renderHome(metas))
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
