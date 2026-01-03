import type { AppType } from "@server/main"
import { treaty } from '@elysiajs/eden'

// https://testing-treaty.onrender.com


export const api = treaty<AppType>("https://testing-treaty.onrender.com")

