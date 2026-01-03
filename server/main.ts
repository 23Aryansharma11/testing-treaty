import { Elysia } from 'elysia';
import { userRoute } from './user';

const app = new Elysia()
    .get('/', () => ({ hello: 'Bun👋' }))
    .use(userRoute)
    .onError(({ code, error }) => {
        console.error(`Error [${code}]:`, error);
        return { error: error };
    });

const PORT = process.env.PORT || 8080;
app.listen(PORT);


export type AppType = typeof app;
export { app };
