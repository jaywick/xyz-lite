import React from 'react'

interface Props {
    meta: any
    html: string
}

const Bullet = () => <> &bull; </>

export const Page = (props: Props) => (
    <body>
        <article>
            <header>
                <h1>{props.meta.title}</h1>
                <div className="byline">
                    <address className="author">{props.meta.author}</address>
                    <Bullet />
                    <time dateTime={props.meta.date}>
                        {props.meta.readableDate}
                    </time>
                    <Bullet />
                    <span>{props.meta.readTime}</span>
                </div>
            </header>
            <div
                aria-roledescription="article content"
                dangerouslySetInnerHTML={{ __html: props.html }}
            />
        </article>
    </body>
)
