import express from 'express'
import paths from 'path'

const PORT = 3000

export const startDevServer = () => {
    const app = express()
    app.use(express.static(paths.resolve(`${__dirname}/../../dist`)))

    app.listen(3000)
    console.info(`Started dev server @ http://127.0.0.1:${PORT}/`)
}
