import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    console.log('Preload.init()')
  }

  preload () {
    console.log('Preload.preload()')

    //
    // load Splash assets
    //

    this.load.image('logo', 'assets/images/logo-360_360.jpg')
    this.load.image('platform', 'assets/images/platform.jpg')
    this.load.image('platform1', 'assets/images/platform1.png')
    this.load.image('platform2', 'assets/images/platform2.png')
    this.load.image('platform3', 'assets/images/platform3.png')
    this.load.image('platform4', 'assets/images/platform4.png')
    this.load.image('platform5', 'assets/images/platform5.png')
    this.load.spritesheet('player', 'assets/images/axeknight.png', 59, 67)
    this.load.spritesheet('owl', 'assets/images/owl.png', 58, 73)
    this.load.spritesheet('star', 'assets/images/stars.png', 47, 33)
    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1)
  }

  create () {
    console.log('Preload.create()')

    this.state.start('Splash')
  }
}
