import { offensiveMagic, defensiveMagic } from '../../modules/gameData.js'
const { ref, computed } = Vue

export default {
  setup() {
    const columns = [
      { key: 'attackerAction', text: 'Attacker Action' },
      { key: 'defenderAction', text: 'Defender Action' },
      { key: 'damageLow', text: 'Damage Low' },
      { key: 'damageHigh', text: 'Damage High' },
      { key: 'hitChance', text: 'Hit Chance' },
    ]

    const player = ref({
      attack: 1,
      defense: 1,
      magic: 1,
      speed: 1,
      hasWeaponProficiencyBonus: false,
      offensiveMagic: null,
      defensiveMagic: null,
    })

    const opponent = ref({
      attack: 1,
      defense: 1,
      magic: 1,
      speed: 1,
      hasWeaponProficiencyBonus: false,
      offensiveMagic: null,
      defensiveMagic: null,
    })

    const playerIsAttacker = ref(true)

    const attackerOptions = [
      { value: true, text: 'Player', },
      { value: false, text: 'Opponent', },
    ]

    const offensiveMagicPowerLookup = new Map(offensiveMagic.map(x => [x.id, x.power]))
    const defensiveMagicPowerLookup = new Map(defensiveMagic.map(x => [x.id, x.power]))

    const actions = computed(() => {
      const { attacker, defender } = playerIsAttacker.value ? { attacker: player.value, defender: opponent.value } : { attacker: opponent.value, defender: player.value }

      const attackerWeaponProficiencyBonus = attacker.hasWeaponProficiencyBonus ? 1.3 : 1
      const attackerOffensiveMagicPower = offensiveMagicPowerLookup.get(attacker.offensiveMagic) ?? 0
      const defenderDefensiveMagicPower = defensiveMagicPowerLookup.get(defender.defensiveMagic) ?? 0

      const normalAttackDamageBase = ((attacker.attack * 2.8) - (defender.defense * 1.2)) * attackerWeaponProficiencyBonus
      const normalAttackDamageMagicDefended = normalAttackDamageBase * 1.4
      const normalAttackDamageCountered = normalAttackDamageBase * 1.8
      const normalAttackDamageUnableToReact = normalAttackDamageBase * 2

      const magicAttackDamageBase = ((attacker.magic * 2.4) - defender.magic) * attackerOffensiveMagicPower * (1 - defenderDefensiveMagicPower)
      const magicAttackDamageDefended = magicAttackDamageBase * 1.4
      const magicAttackDamageCountered = magicAttackDamageBase * 1.8
      const magicAttackDamageUnableToReact = magicAttackDamageBase * 2

      const strikeDamageBase = (((attacker.attack + attacker.magic + attacker.speed) * 2.5) - (defender.defense + defender.magic + defender.speed)) * attackerWeaponProficiencyBonus
      const strikeDamageDefended = strikeDamageBase * 1.6
      const strikeDamageMagicDefended = strikeDamageBase * 1.7
      const strikeDamageUnableToReact = strikeDamageBase * 2.5

      const strikeCounterDamage = (((defender.attack + defender.magic + defender.speed) * 4) + ((attacker.attack - attacker.defense) * 2)) * attackerWeaponProficiencyBonus

      const hitChance = Math.min(Math.max((attacker.speed / (attacker.speed + defender.speed)) + 0.25, 0.5), 1)

      return [
        { attackerAction: 'Attack', defenderAction: 'Defend', damage: { low: Math.round(normalAttackDamageBase * 0.95), high: Math.round(normalAttackDamageBase * 1.05) }, hitChance },
        { attackerAction: 'Attack', defenderAction: 'Magic Defend', damage: { low: Math.round(normalAttackDamageMagicDefended * 0.95), high: Math.round(normalAttackDamageMagicDefended * 1.05) }, hitChance },
        { attackerAction: 'Attack', defenderAction: 'Counter', damage: { low: Math.round(normalAttackDamageCountered * 0.95), high: Math.round(normalAttackDamageCountered * 1.05) }, hitChance },
        { attackerAction: 'Attack', defenderAction: 'None', damage: { low: Math.round(normalAttackDamageUnableToReact * 0.95), high: Math.round(normalAttackDamageUnableToReact * 1.05) }, hitChance },
        { attackerAction: 'Magic Attack', defenderAction: 'Defend', damage: { low: Math.round(magicAttackDamageDefended * 0.95), high: Math.round(magicAttackDamageDefended * 1.05) }, hitChance: 1 },
        { attackerAction: 'Magic Attack', defenderAction: 'Magic Defend', damage: { low: Math.round(magicAttackDamageBase * 0.95), high: Math.round(magicAttackDamageBase * 1.05) }, hitChance: 1 },
        { attackerAction: 'Magic Attack', defenderAction: 'Counter', damage: { low: Math.round(magicAttackDamageCountered * 0.95), high: Math.round(magicAttackDamageCountered * 1.05) }, hitChance: 1 },
        { attackerAction: 'Magic Attack', defenderAction: 'None', damage: { low: Math.round(magicAttackDamageUnableToReact * 0.95), high: Math.round(magicAttackDamageUnableToReact * 1.05) }, hitChance: 1 },
        { attackerAction: 'Strike', defenderAction: 'Defend', damage: { low: Math.round(strikeDamageDefended * 0.95), high: Math.round(strikeDamageDefended * 1.05) }, hitChance },
        { attackerAction: 'Strike', defenderAction: 'Magic Defend', damage: { low: Math.round(strikeDamageMagicDefended * 0.95), high: Math.round(strikeDamageMagicDefended * 1.05) }, hitChance },
        { attackerAction: 'Strike', defenderAction: 'Counter', damage: { low: Math.round(strikeCounterDamage * 0.95), high: Math.round(strikeCounterDamage * 1.05) }, hitChance },
        { attackerAction: 'Strike', defenderAction: 'None', damage: { low: Math.round(strikeDamageUnableToReact * 0.95), high: Math.round(strikeDamageUnableToReact * 1.05) }, hitChance },
      ]
    })

    const newWeapon = ref({
      attack: 1,
      hasWeaponProficiencyBonus: false,
    })

    const newWeaponBreakEven = computed(() => {
      const originalWeaponProficiencyBonus = player.value.hasWeaponProficiencyBonus ? 1.3 : 1
      const newWeaponProficiencyBonus = newWeapon.value.hasWeaponProficiencyBonus ? 1.3 : 1
      player.value.magic
      player.value.speed

      if (newWeapon.value.attack < player.value.attack || (newWeapon.value.attack == player.value.attack && originalWeaponProficiencyBonus > newWeaponProficiencyBonus))
        return { attack: Number.NEGATIVE_INFINITY, strike: Number.NEGATIVE_INFINITY }
      
      if (originalWeaponProficiencyBonus == newWeaponProficiencyBonus)
        return { attack: 0, strike: 0 }

      const breakEvenDefense = ((newWeapon.value.attack * newWeaponProficiencyBonus * 2.8) - (player.value.attack * originalWeaponProficiencyBonus * 2.8)) / ((newWeaponProficiencyBonus * 1.2) - (originalWeaponProficiencyBonus * 1.2))

      const breakEvenStats = (((newWeapon.value.attack + player.value.magic + player.value.speed) * newWeaponProficiencyBonus * 2.5) - ((player.value.attack + player.value.magic + player.value.speed) * originalWeaponProficiencyBonus * 2.5)) / (newWeaponProficiencyBonus - originalWeaponProficiencyBonus)

      return { attack: Math.max(breakEvenDefense, 0), strike: Math.max(breakEvenStats, 0) }
    })

    return {
      columns,
      player,
      opponent,
      playerIsAttacker,
      attackerOptions,
      actions,
      newWeapon,
      newWeaponBreakEven,
    }
  },
}
