const { computed } = Vue

export default {
  props: {
    modelValue: {
      type: String,
    },
    options: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const value = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    return {
      value,
    }
  },
}
