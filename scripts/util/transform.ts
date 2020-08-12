import { promises as fs } from 'fs'
import paths from 'path'
import { renderPage, renderIndex, renderHome } from './render'
import showdown from 'showdown'
import showdownHighlight from 'showdown-highlight'

export const createHtml = async (docs: IDoc[]) => {
    for await (const doc of docs) {
        const html = transform(doc.content)
        const newFile = paths.resolve(
            `${__dirname}../../../dist/blog/${doc.id}/index.html`
        )
        const pageContent = renderPage(html, doc)
        await fs.writeFile(newFile, pageContent, { flag: 'w' })
    }

    console.info(`Created ${docs.length} html files`)
}

export const createIndexes = async (metas: IDoc[]) => {
    const blogsPath = paths.resolve(`${__dirname}/../../dist/blog/index.html`)
    await fs.writeFile(blogsPath, renderIndex(metas), { flag: 'w' })

    const homePath = paths.resolve(`${__dirname}/../../dist/index.html`)
    await fs.writeFile(homePath, renderHome(metas), { flag: 'w' })
}

const showdownMark = () => [
    {
        type: 'lang',
        regex: /==(.+?)==/g,
        replace: '<mark>$1</mark>',
    },
]

const showdownLazyImage = () => [
    {
        type: 'output',
        regex: new RegExp(`<img(.*)>`, 'g'),
        replace: '<img loading="lazy" $1>',
    },
]

const transform = (text: string) => {
    const converter = new showdown.Converter({
        ...showdown.getDefaultOptions(),
        ghCompatibleHeaderId: true,
        headerLevelStart: 2,
        strikethrough: true,
        tables: true,
        extensions: [showdownHighlight, showdownMark, showdownLazyImage],
        literalMidWordUnderscores: true,
        simplifiedAutoLink: true,
    })

    return converter.makeHtml(text)
}
