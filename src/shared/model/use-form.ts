import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { reactive } from 'vue'
import type { Path } from 'vee-validate'
import {
  ZodObject,
  type ZodRawShape,
  type infer as Infer,
} from 'zod'
import type { FormFields } from './types'

export function useUniversalForm<
  TSchema extends ZodRawShape,
>(schema: ZodObject<TSchema>) {
  type FormValues = Infer<typeof schema>

  const form = useForm<FormValues>({
    validationSchema: toTypedSchema(schema),
  })

  const plainFields = {} as FormFields<FormValues>

  const keys = Object.keys(
    schema.shape,
  ) as (keyof FormValues & string)[]

  for (const key of keys) {
    const [value, attrs] = form.defineField(
      key as Path<FormValues>,
    )

    plainFields[key as keyof FormValues] = {
      value,
      attrs,
    } as FormFields<FormValues>[keyof FormValues]
  }

  const fields = reactive(plainFields)

  return {
    ...form,
    fields,
  }
}
