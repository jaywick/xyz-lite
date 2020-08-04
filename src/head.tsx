import React from 'react'

interface Props {
    title: string
    author: string
    description: string
    hero: string
    url: string
    date: string
    readTime: string
}

export const Head = (props: Props) => (
    <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fff" />
        <meta itemProp="name" content={props.title} />
        <meta itemProp="description" content={props.description} />
        <meta itemProp="image" content={props.hero} />
        <meta name="description" content={props.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.description} />
        <meta name="twitter:creator" />
        <meta name="twitter:image" content={props.hero} />
        <meta property="og:title" content={props.title} />
        <meta property="og:url" content={props.url} />
        <meta property="og:image" content={props.hero} />
        <meta property="og:description" content={props.description} />
        <meta property="og:site_name" />
        <meta name="article:published_time" content={props.date} />
        <meta name="twitter:label1" content="Reading time" />
        <meta name="twitter:data1" content={props.readTime} />
        <link rel="shortcut icon" href="/favicon-16.png" />
        <link
            rel="stylesheet"
            type="text/css"
            href="/theme-dark.css"
            media="screen and (prefers-color-scheme: dark)"
        />
        <link
            rel="stylesheet"
            type="text/css"
            href="/theme-light.css"
            media="screen and (prefers-color-scheme: light)"
        />
        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <link
            rel="stylesheet"
            type="text/css"
            href="//fonts.googleapis.com/css2?family=Roboto+Slab&display=swap"
        />
        <link
            rel="stylesheet"
            type="text/css"
            media="screen and (prefers-color-scheme: dark)"
            href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/night-owl.min.css"
        />
        <link
            rel="stylesheet"
            type="text/css"
            media="screen and (prefers-color-scheme: light)"
            href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/github-gist.min.css"
        />
        <meta name="theme-color" content="#111216" />
        <link rel="apple-touch-icon" sizes="64x64" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon-512.png" />
    </head>
)
