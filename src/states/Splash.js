import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    console.log('Splash.init()')
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  }

  preload () {
    console.log('Splash.preload()')

    this.logo = this.add.sprite(0, this.game.height - 360 - 180, 'logo')
  }

  create () {
    console.log('Splash.create()')
    this.stage.backgroundColor = '#fff'
    this.game.input.onDown.add(this.clickHandler, this)
  }

  render () {
    // if (this.spacebar.isDown) {
    //   this.state.start('Game')
    // }
  }

  clickHandler () {
    this.state.start('Game')
  }
}
