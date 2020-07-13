import { renderToStaticMarkup } from 'react-dom/server'
import { transform } from './md'
import matter from 'gray-matter'
import { Head } from '../../src/head'
import React from 'react'
import { Page } from '../../src/page'

export const render = (markdown: string) => {
    const { content, data: frontmatter } = matter(markdown)
    const html = transform(content)

    const meta: any = {
        ...frontmatter,
        author: 'Jay Wick',
        readableDate: readableDate(frontmatter.date),
        readTime: readTime(content),
    }

    return renderToStaticMarkup(
        <html>
            <Head
                date={readableDate(meta.date)}
                description={meta.description}
                favicon={{}}
                url=""
                author={meta.author}
                hero={meta.hero}
                readTime={readTime(content)}
                title={meta.title}
            />
            <Page html={html} meta={meta} />
        </html>
    )
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
