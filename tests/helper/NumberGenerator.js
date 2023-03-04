class NumberGenerator {

  getRandomNumber() {
    let number = Math.floor(Math.random() * 10000)
    return number
  }

}

export default new NumberGenerator();