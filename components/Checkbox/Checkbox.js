const { computed } = Vue

export default {
  props: {
    modelValue: {
      type: Boolean,
    },
    threeState: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const indeterminate = computed(() => {
      return props.threeState && (props.modelValue === null || props.modelValue === undefined)
    })

    function toggleState() {
      emit('update:modelValue', shiftState())

      function shiftState() {
        if (!props.threeState)
          return !props.modelValue
        
        if (props.modelValue)
          return null
        else if (props.modelValue === undefined || props.modelValue === null)
          return false
        else
          return true
      }
    }

    return {
      indeterminate,
      toggleState,
    }
  },
}
