import express, { urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { router } from './routers/router'
import { mongoConnect } from './database/mongo'

const server = express()

mongoConnect()
server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(urlencoded({ extended: true }))

server.use(router)

const port = process.env.PORT || 5000

server.listen(port, () => [
    console.log(`Servidor rodando em : http://localhost:${port}`)
])