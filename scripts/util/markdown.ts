import { promises as fs } from 'fs'
import paths from 'path'
import matter from 'gray-matter'
import { IDoc } from '../../types'

export const extractMeta = async (docPath: string): Promise<IDoc> => {
    const markdown = String(await fs.readFile(docPath))
    const { content, data: frontmatter } = matter(markdown)

    const articleId = paths.basename(paths.dirname(docPath))

    return {
        title: frontmatter.title,
        date: frontmatter.date,
        slug: frontmatter.slug || slugify(frontmatter.title),
        hero: frontmatter.hero,
        tag: frontmatter.tag,
        author: 'Jay Wick',
        readableDate: readableDate(frontmatter.date),
        readTime: readTime(content),
        url: `/blog/${articleId}/${frontmatter.slug}`,
        id: articleId,
        content,
    }
}

const slugify = (string: string) => {
    return string
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

const READ_SPEED = 250 // wpm
const IMAGE_SPEED = 5 / 60 // 5s per image

const readTime = (content: string) => {
    const words = content.match(/[\w-]+/g)?.length ?? 0
    const images = content.match(/\!\[.+?\]\(.+?\)/g)?.length ?? 0
    const value = Math.ceil(words / READ_SPEED + images * IMAGE_SPEED)

    return `${value} min read`
}

const readableDate = (value: string) => {
    return new Date(Date.parse(value)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
