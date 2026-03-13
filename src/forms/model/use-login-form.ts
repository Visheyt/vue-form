import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { loginSchema, type LoginType } from './schema'

export const useLoginForm = () => {
  const { handleSubmit, errors, defineField, meta } =
    useForm<LoginType>({
      validationSchema: toTypedSchema(loginSchema),
      initialValues: {
        login: '',
        password: '',
      },
    })

  const [login, loginProps] = defineField('login')

  const [password, passwordProps] = defineField('password')

  return {
    login,
    loginProps,
    password,
    passwordProps,
    handleSubmit,
    errors,
    meta,
  }
}
