// @ts-ignore
import showdown from 'showdown'
import showdownHighlight from 'showdown-highlight'

const showdownMark = () => [
    {
        type: 'lang',
        regex: /==(.+?)==/g,
        replace: '<mark>$1</mark>',
    },
]

const showdownLazyImage = () => [
    {
        type: 'output',
        regex: new RegExp(`<img(.*)>`, 'g'),
        replace: '<img loading="lazy" $1>',
    },
]

export const transform = (text: string) => {
    const converter = new showdown.Converter({
        ...showdown.getDefaultOptions(),
        ghCompatibleHeaderId: true,
        headerLevelStart: 2,
        strikethrough: true,
        tables: true,
        extensions: [showdownHighlight, showdownMark, showdownLazyImage],
        literalMidWordUnderscores: true,
        simplifiedAutoLink: true,
    })

    const textWithFixedLinks = text.replace(
        /(?:!\[(.*?)\]\((.+?)\))/gim,
        (substring, altText: string, path: string) => {
            if (path.startsWith('./')) {
                return `![${altText}](.${path})`
            }
            return substring
        }
    )

    return converter.makeHtml(textWithFixedLinks)
}
