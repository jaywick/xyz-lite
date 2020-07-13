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

export const transform = (text: string) => {
    const converter = new showdown.Converter({
        ...showdown.getDefaultOptions(),
        ghCompatibleHeaderId: true,
        headerLevelStart: 2,
        strikethrough: true,
        tables: true,
        extensions: [showdownHighlight, showdownMark],
    })
    return converter.makeHtml(text)
}
