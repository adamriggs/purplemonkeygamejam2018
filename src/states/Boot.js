import Phaser from 'phaser'
// import WebFont from 'webfontloader'
import config from '../config'

export default class extends Phaser.State {
  init () {
    console.log('Boot.init()')
    this.stage.backgroundColor = '#000'

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 1000

    this.game.world.setBounds(0, 0, config.gameWidth, config.gameHeight + 300)
  }

  preload () {
    console.log('Boot.preload()')

    //
    // load preloader assets
    //
  }

  create () {
    console.log('Boot.create()')
    this.game.stage.backgroundColor = '#fff'
    this.state.start('Preload')
  }

  render () {
    console.log('Boot.render()')
  }
}
