import React from 'react'

interface Props {
    title: string
    author: string
    description: string
    hero: string
    url: string
    date: string
    readTime: string
    favicon: { [key: string]: string }
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
        <link rel="shortcut icon" href={props.favicon['48']} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="stylesheet" href="/manifest.webmanifest" />
        <link rel="stylesheet" type="text/css" href="/style.css" />
        <meta name="theme-color" content="#111216" />
        <link rel="apple-touch-icon" sizes="48x48" href={props.favicon['48']} />
        <link rel="apple-touch-icon" sizes="72x72" href={props.favicon['72']} />
        <link rel="apple-touch-icon" sizes="96x96" href={props.favicon['96']} />
        <link
            rel="apple-touch-icon"
            sizes="144x144"
            href={props.favicon['144']}
        />
        <link
            rel="apple-touch-icon"
            sizes="192x192"
            href={props.favicon['192']}
        />
        <link
            rel="apple-touch-icon"
            sizes="256x256"
            href={props.favicon['256']}
        />
        <link
            rel="apple-touch-icon"
            sizes="384x384"
            href={props.favicon['384']}
        />
        <link
            rel="apple-touch-icon"
            sizes="512x512"
            href={props.favicon['512']}
        />
    </head>
)
