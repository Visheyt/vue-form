import type {
  GenericObject,
  BaseFieldProps,
} from 'vee-validate'
import type { Ref } from 'vue'

export type FormFields<Values extends GenericObject> = {
  [K in keyof Values]: {
    value: Ref<Values[K]>
    attrs: Ref<BaseFieldProps & GenericObject>
  }
}
