/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    console.log('Game.init()')
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.RUNNING_SPEED = 180
    this.JUMPING_SPEED = 550

    this.gameOver = false
    this.level = 0
  }
  preload () {
    this.load.text('level', 'assets/data/level.json')
  }

  create () {
    console.log('Game.create()')

    // game.time.events.stop()
    this.levels = JSON.parse(this.game.cache.getText('level'))

    game.world.removeAll()
    this.gameOver = false
    this.stage.backgroundColor = '#000'

    var count = Object.keys(this.levels).length

    if (this.level >= count) {
      console.log('level count too hight')
      this.level = 0
    }

    this.levelData = this.levels[this.level]
    this.platforms = this.add.group()
    this.platforms.enableBody = true

    this.levelData.platformData.forEach(function (element) {
      this.platforms.create(element.x, element.y, 'platform' + element.width)
    }, this)

    this.platforms.setAll('body.immovable', true)
    this.platforms.setAll('body.allowGravity', false)

    // create fire
    this.fires = this.add.group()
    this.fires.enableBody = true

    var fire
    this.levelData.fireData.forEach(function (element) {
      fire = this.fires.create(element.x, element.y, 'fire')
      fire.animations.add('fire', [0, 1], 4, true)
      fire.play('fire')
    }, this)

    this.fires.setAll('body.allowGravity', false)

    // create stars
    this.stars = this.add.group()
    this.stars.enableBody = true

    this.createStar()
    if (!this.starCreator) {
      this.starCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.starFrequency, this.createStar, this)
    } 
    // console.log(this.starCreator)

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
    this.game.physics.arcade.enable(this.owl)
    this.owl.customParams = {}
    this.owl.body.collideWorldBounds = true
    this.owl.body.allowGravity = false

    this.game.input.onDown.add(this.clickHandler, this)
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.platforms)
    this.game.physics.arcade.collide(this.stars, this.platforms)

    this.player.body.velocity.x = 0

    if (!this.gameOver) {
      this.game.physics.arcade.overlap(this.player, this.fires, this.endGame, null, this)
      this.game.physics.arcade.overlap(this.player, this.stars, this.starCollision, null, this)

      this.game.physics.arcade.overlap(this.player, this.owl, this.win, null, this)

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
        if (element.x < 10 && element.y > 550) {
          element.kill()
        }
      }, this)
    } else {
      this.stars.forEach(function (element) {
        element.animations.stop()
        element.body.velocity.x = 0
      })

      // game.time.events.stop()
      this.stopStarCreator()
    }
  }

  starCollision (player, star) {
    // console.log('starCollision()')
    if (this.cursors.left.isDown || this.player.customParams.isMovingLeft || this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      star.kill()
    } else {
      this.endGame()
    }
  }

  win (player, owl) {
    // alert('you win!')
    var style = { font: '32px Arial', fill: '#000000', wordWrap: true, align: 'center', backgroundColor: '#ffffff' }
    this.text = game.add.text(140, 260, 'You Win!', style)
    this.gameOver = true
    this.level++
    this.create()
  }

  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.player, 32, 32)
    // }
  }

  stopStarCreator () {
    // console.log('stopStarCreator()')
    game.time.events.remove(this.starCreator)
    // this.starCreator.timer.remove(this.starCreator)
    this.starCreator = null
  }

  endGame (player, badguy) {
    // console.log('endGame()')
    var style = { font: '32px Arial', fill: '#000000', wordWrap: true, align: 'center', backgroundColor: '#ffffff' }
    this.text = game.add.text(140, 260, 'Game Over!', style)
    this.gameOver = true
    this.stopStarCreator()
  }

  clickHandler () {
    if (this.gameOver) {
      // game.state.start('Game')
      this.create()
    }
  }

  createStar () {
    // console.log('createStar()')
    // give me first dead sprite
    var star = this.stars.getFirstExists(false)

    if (!star) {
      // console.log('new star created')
      star = this.stars.create(0 ,0, 'star')
    }

    star.body.collideWorldBounds = true
    star.body.bounce.set(1, 0)

    star.reset(this.levelData.goal.x, this.levelData.goal.y)
    star.body.velocity.x = this.levelData.starSpeed

    star.animations.add('star', [0, 1, 2, 1], 12, true)
    star.play('star')
  }
}
