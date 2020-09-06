import express, { Application } from 'express'
import paths from 'path'
import { promises as fs } from 'fs'

const PORT = 3000

export const startDevServer = () => {
    const app = express()
    app.use(
        express.static(paths.resolve(`${__dirname}/../../dist`), {
            extensions: ['html'],
        })
    )

    // createRedirects(app)

    app.listen(3000)
    console.info(`Started dev server @ http://127.0.0.1:${PORT}/`)
}

// const createRedirects = async (app: Application) => {
//     const rules = String(
//         await fs.readFile(paths.resolve(`${__dirname}/../../dist/_redirects`))
//     )

//     rules.split('\n').forEach((rule) => {
//         const [source, target, code] = rule.split(' ').filter(Boolean)

//         app.get(source, (_, res) => {
//             res.redirect(target)
//         })
//     })
// }
