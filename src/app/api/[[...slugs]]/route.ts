import { Elysia, t } from 'elysia'

const client = new Elysia({ prefix: '/api' })
    .get('/hola', {
        gabi: 'Hello Nextjs'
    })
// .post('/', ({ body }) => body, {
//     body: t.Object({
//         name: t.String()
//     })
// })

export const GET = client.fetch
export const POST = client.fetch 