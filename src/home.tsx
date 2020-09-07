import React from 'react'
import { Header } from './header'
import { IDoc } from '../types'

interface Props {
    metas: IDoc[]
}

export const Home = (props: Props) => (
    <body>
        <main>
            <Header
                title="Jay Wick"
                subtitle="UX developer, amateur designer, and technology apologist. This is my blog and portfolio."
                appearance="large"
            />
            <section>
                <h2>Projects</h2>
                <ul>
                    {props.metas
                        .filter((meta) =>
                            ['kalq', 'newsfeed', 'blackstorm-alpha'].includes(
                                meta.tag
                            )
                        )
                        .map((meta) => (
                            <li key={meta.id}>
                                <a href={meta.url}>{meta.title}</a>
                            </li>
                        ))}
                </ul>
            </section>
            <section>
                <h2>Life</h2>
                <ul>
                    {props.metas
                        .filter((meta) => meta.tag === 'life')
                        .map((meta) => (
                            <li key={meta.id}>
                                <a href={meta.url}>{meta.title}</a>
                            </li>
                        ))}
                </ul>
            </section>
            <section>
                <h2>Gadgets</h2>
                <ul>
                    {props.metas
                        .filter((meta) => meta.tag === 'gadgets')
                        .map((meta) => (
                            <li key={meta.id}>
                                <a href={meta.url}>{meta.title}</a>
                            </li>
                        ))}
                </ul>
            </section>
        </main>
    </body>
)
