import Elysia, { t } from "elysia";
import { User, users } from "./db";

const userSchema = t.Object({
    id: t.Number(),
    name: t.String({ minLength: 3 }),
    email: t.String({ format: "email" }),
    age: t.Number({ minimum: 18 })
});

export const userRoute = new Elysia({ prefix: "/user" })
    .get("/", ({ set }) => {
        set.status = 200;
        return { users }; // Fixed: use 'users' (plural)
    })

    // POST /user - Create new user
    .post("/", async ({ body, set }) => {
        const newUser = { id: users.length + 1, ...body };
        users.push(newUser);
        set.status = 201;
        return { message: "User created", user: newUser };
    }, {
        body: t.Pick(userSchema, ["name", "email", "age"]) // Partial without id
    })

    // GET /user/:id - Get single user
    .get("/:id", async ({ params: { id }, set }) => {
        const user = users.find(u => u.id === Number(id));
        if (!user) {
            set.status = 404;
            return { error: "User not found" };
        }
        set.status = 200;
        return { user };
    }, {
        params: t.Object({ id: t.Numeric() })
    })

    // PUT /user/:id - Update user
    .put("/:id", async ({ params: { id }, body, set }) => {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            set.status = 404;
            return { error: "User not found" };
        }
        users[index] = { ...users[index], ...body } as User;
        set.status = 200;
        return { message: "User updated", user: users[index] };
    }, {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(userSchema)
    })

    // PATCH /user/:id - Partial update
    .patch("/:id", async ({ params: { id }, body, set }) => {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            set.status = 404;
            return { error: "User not found" };
        }
        users[index] = { ...users[index], ...body } as User;
        set.status = 200;
        return { message: "User updated", user: users[index] };
    }, {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(userSchema)
    })

    // DELETE /user/:id - Delete user
    .delete("/:id", async ({ params: { id }, set }) => {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) {
            set.status = 404;
            return { error: "User not found" };
        }
        users.splice(index, 1);
        set.status = 200;
        return { message: "User deleted" };
    }, {
        params: t.Object({ id: t.Numeric() })
    });
