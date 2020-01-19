const numbers = ['one', 'two', 'three', 'four', 'five', 'six']

export default {
  run() {
    const randomNumber = Math.floor(Math.random() * 6)
    return [
      {type: 'text', text: `You rolled a ${numbers[randomNumber]}.`}
    ]
  },
  help: {
    details: 'roll a six-sided die'
  }
}
