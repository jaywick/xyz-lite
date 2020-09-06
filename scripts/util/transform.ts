import { promises as fs } from 'fs'
import paths from 'path'
import { renderPage, renderIndex, renderHome } from './render'

import unified from 'unified'
import remarkParse from 'remark-parse'
// @ts-ignore
import remarkSlug from 'remark-slug'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { lazyImages } from './transformer-plugins/images'

export const createHtml = async (docs: IDoc[]) => {
    for await (const doc of docs) {
        const html = await transform(doc.content)
        const newFile = paths.resolve(
            `${__dirname}../../../dist/blog/${doc.id}/${doc.slug}.html`
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

// const showdownMark = () => [
//     {
//         type: 'lang',
//         regex: /==(.+?)==/g,
//         replace: '<mark>$1</mark>',
//     },
// ]

// const showdownLazyImage = () => [
//     {
//         type: 'output',
//         regex: new RegExp(`<img(.*)>`, 'g'),
//         replace: '<img loading="lazy" $1>',
//     },
// ]

const transform = async (text: string): Promise<string> => {
    // const converter = new showdown.Converter({
    //     ...showdown.getDefaultOptions(),
    //     ghCompatibleHeaderId: true,
    //     headerLevelStart: 2,
    //     strikethrough: true,
    //     tables: true,
    //     extensions: [showdownHighlight, showdownMark, showdownLazyImage],
    //     literalMidWordUnderscores: true,
    //     simplifiedAutoLink: true,
    // })

    // return converter.makeHtml(text)

    const processor = unified()
        .use(remarkParse)
        .use(remarkSlug)
        .use(remarkRehype)
        .use(rehypeStringify)
        .use(lazyImages as any)

    const result = await processor.process(text)
    return String(result)
}
