/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    console.log('Game.init()')
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.RUNNING_SPEED = 180
    this.JUMPING_SPEED = 550
  }
  preload () {
    this.load.text('level', 'assets/data/level.json')
  }

  create () {
    console.log('Game.create()')

    this.stage.backgroundColor = '#000'

    this.levels = JSON.parse(this.game.cache.getText('level'))
    this.levelData = this.levels.level1
    this.platforms = this.add.group()
    this.platforms.enableBody = true

    this.levelData.platformData.forEach(function (element) {
      this.platforms.create(element.x, element.y, 'platform' + element.width)
    }, this)

    this.platforms.setAll('body.immovable', true)
    this.platforms.setAll('body.allowGravity', false)

    // create stars
    this.stars = this.add.group()
    this.stars.enableBody = true

    this.createStar()
    this.starCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.starFrequency, this.createStar, this)

    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3)
    this.player.anchor.setTo(0.5)
    this.player.animations.add('walking', [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1], 96, true)
    this.player.play('walking')
    this.game.physics.arcade.enable(this.player)
    this.player.customParams = {}
    this.player.body.collideWorldBounds = true

    this.owl = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'owl', 3)
    this.owl.anchor.setTo(0.5)
    this.owl.animations.add('flutter', [0, 1, 2, 3, 4, 5, 6, 7, 8], 12, true)
    this.owl.play('flutter')

    // this.star = this.add.sprite(60, 120, 'star', 3)
    // this.star.anchor.setTo(0.5)
    // this.star.animations.add('star', [0, 1, 2, 1], 12, true)
    // this.star.play('star')
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.platforms)
    this.game.physics.arcade.collide(this.stars, this.platforms)

    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED
      this.player.scale.setTo(1, 1)
      this.player.play('walking')
    } else if (this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED
      this.player.scale.setTo(-1, 1)
      this.player.play('walking')
    } else {
      this.player.animations.stop()
      this.player.frame = 1
    }

    if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED
      this.player.customParams.mustJump = false
    }

    this.stars.forEach(function (element) {
      if (element.x < 10 && element.y > 600) {
        element.kill()
      }
    }, this)
  }

  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }

  createStar () {
    console.log('createStar()')
    // give me first dead sprite
    var star = this.stars.getFirstExists(false)

    if (!star) {
      console.log('new star created')
      star = this.stars.create(0 ,0, 'star')
    }

    star.body.collideWorldBounds = true
    star.body.bounce.set(1, 0)

    star.reset(this.levelData.goal.x, this.levelData.goal.y)
    star.body.velocity.x = this.levelData.starSpeed
  }
}
