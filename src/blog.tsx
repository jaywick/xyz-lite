import React from 'react'
import { Header } from './header'

interface Props {
    metas: IMeta[]
}

export const Blog = (props: Props) => (
    <body>
        <Header title="Jay Wick" appearance="small" />
        <ul>
            {props.metas.map((meta) => (
                <li key={meta.id}>
                    <a href={meta.url}>{meta.title}</a>
                </li>
            ))}
        </ul>
    </body>
)
