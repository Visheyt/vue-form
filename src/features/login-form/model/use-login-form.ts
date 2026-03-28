import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { loginSchema, type LoginType } from './schema'

export const useLoginForm = () => {
  const {
    values,
    handleSubmit,
    errors,
    defineField,
    meta,
  } = useForm<LoginType>({
    validationSchema: toTypedSchema(loginSchema),
    initialValues: {
      login: '',
      password: '',
    },
  })

  const [login, loginProps] = defineField('login', {
    validateOnModelUpdate: false, //пока юзер вводит ошибок не будет
  })

  const [password, passwordProps] = defineField('password')

  return {
    login,
    loginProps,
    password,
    passwordProps,
    handleSubmit,
    errors,
    meta,
    values,
  }
}
