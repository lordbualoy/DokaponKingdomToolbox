import { offensiveMagic, defensiveMagic } from '../../modules/gameData.js'

export default {
  props: {
    title: {
      type: String,
    },
    character: {
      type: Object,
    },
  },
  setup() {
    return {
      offensiveMagicOptions: [{ value: null, text: 'None', }, ...offensiveMagic.map(x => ({ value: x.id, text: x.name, }))],
      defensiveMagicOptions: [{ value: null, text: 'None', }, ...defensiveMagic.map(x => ({ value: x.id, text: x.name, }))],
    }
  },
}
