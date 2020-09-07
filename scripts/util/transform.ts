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
import { IContext } from './context'
// @ts-ignore
import rehypeHighlight from 'rehype-highlight'

export const createHtml = async ({ docs: metas }: IContext) => {
    for await (const doc of metas) {
        const html = await transform(doc.content)
        const newFile = paths.resolve(
            `${__dirname}../../../dist/blog/${doc.id}/${doc.slug}.html`
        )
        const pageContent = renderPage(html, doc)
        await fs.writeFile(newFile, pageContent, { flag: 'w' })
    }

    console.info(`Created ${metas.length} html files`)
}

export const createIndexes = async ({ docs: metas }: IContext) => {
    const blogsPath = paths.resolve(`${__dirname}/../../dist/blog/index.html`)
    await fs.writeFile(blogsPath, renderIndex(metas), { flag: 'w' })

    const homePath = paths.resolve(`${__dirname}/../../dist/index.html`)
    await fs.writeFile(homePath, renderHome(metas), { flag: 'w' })
}

const transform = async (text: string): Promise<string> => {
    const processor = unified()
        .use(remarkParse)
        .use(remarkSlug)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .use(lazyImages)

    const result = await processor.process(text)
    return String(result)
}
