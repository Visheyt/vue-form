import z, { object, string } from 'zod'

export const loginSchema = object({
  login: string().min(3, 'Логин должен состоять как минимум из 3х знаков '),
  password: string()
    .min(8, 'Пароль слишком короткий')
    .regex(/[A-Z]/, 'Добавьте заглавную букву')
    .regex(/[a-z]/, 'Добавьте строчную букву')
    .regex(/[0-9]/, 'Добавьте цифру'),
})

export type LoginType = z.infer<typeof loginSchema>
