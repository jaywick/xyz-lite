import { renderToStaticMarkup } from 'react-dom/server'
import { transform } from './md'
import matter from 'gray-matter'
import { Head } from '../../src/head'
import React from 'react'
import { Page } from '../../src/page'
import { Blog } from '../../src/blog'
import { Home } from '../../src/home'

export const renderPage = (pageHtml: string, meta: any) => {
    const html = renderToStaticMarkup(
        <html>
            <Head
                date={meta.readableDate}
                description={meta.description}
                favicon={{}}
                url=""
                author={meta.author}
                hero={meta.hero}
                readTime={meta.readTime}
                title={meta.title}
            />
            <Page html={pageHtml} meta={meta} />
        </html>
    )

    return `<!DOCTYPE html>\n${html}`
}

export const renderIndex = (metas: any[]) => {
    const html = renderToStaticMarkup(
        <html>
            <Head
                author="Jay Wick"
                date=""
                description="List of blog posts"
                favicon={{}}
                hero=""
                readTime=""
                title="Blog posts"
                url="/blog"
            />
            <Blog metas={metas} />
        </html>
    )

    return `<!DOCTYPE html>\n${html}`
}

export const renderHome = (metas: any[]) => {
    const html = renderToStaticMarkup(
        <html>
            <Head
                author="Jay Wick"
                date=""
                description="List of blog posts"
                favicon={{}}
                hero=""
                readTime=""
                title="Blog posts"
                url="/"
            />
            <Home metas={metas} />
        </html>
    )

    return `<!DOCTYPE html>\n${html}`
}
