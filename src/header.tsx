import React from 'react'

type Props =
    | {
          title: string
          subtitle: string
          appearance: 'large'
      }
    | {
          title: string
          appearance: 'small'
      }

export function Header(props: Props) {
    if (props.appearance === 'small') {
        return (
            <header className="title title-small">
                <h1>
                    <a href="/">{props.title}</a>
                </h1>
            </header>
        )
    }

    return (
        <header className="title title-large">
            <h1>{props.title}</h1>
            <p className="tagline">{props.subtitle}</p>
        </header>
    )
}
