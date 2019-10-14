<template>
	<div class="home-wrapper">
    <div class="container" ref="container">
      <div class="info-wrapper">
        <div class="title">
          <h1 class="title--main">Hd-Cmps</h1>
          <h3 class="title--sub">基于vue与element-ui的桌面组件库</h3>
        </div>
        <div class="btn-wrapper">
          <el-button type="primary" @click="navTo('readme')">起步</el-button>
          <el-button @click="navTo('github')">GITHUB</el-button>
        </div>
      </div>
    </div>
    <el-row class="card-wrapper" :gutter="50" type="flex" justify="center">
      <el-col :span="cardSize">
        <el-card shadow="always" class="card-item"  @click.native="navTo('changelog')">
          <div class="card-item--icon">
            <i class="el-icon-document"></i>
          </div>
          <h4>更新日志</h4>
          <div class="test"></div>
        </el-card>
      </el-col>
      <el-col :span="cardSize">
        <el-card shadow="always" class="card-item"  @click.native="navTo('hd-calendar')">
          <div class="card-item--icon">
            <i class="el-icon-present"></i>
          </div>
          <h4>组件</h4>
        </el-card>
      </el-col>
      <el-col :span="cardSize">
        <el-card shadow="always" class="card-item" @click.native="navTo('hdvon')">
          <div class="card-item--icon">
            <i class="el-icon-office-building"></i>
          </div>
          <h4>关于HDVON</h4>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import * as PIXI from 'pixi.js'
// App constraints
const UPPER_LIMIT_Y = 10
const UPPER_LIMIT_X = 2
const LOWER_LIMIT_X = -2
const MAX_SIZE = 7
const MIN_SIZE = 4
const AMOUNT = 1000
const COLOR = 0xffffff
const SPEED = 0.5
// const COLOR_SET = [0xf3f9fb, 0x87c0cd, 0x226597, 0x113f67]
const COLOR_SET = [0xf22613, 0xf9690e, 0xf9bf3b, 0x2ecc71, 0x19b5fe, 0x663399, 0x947cb0]
// const COLOR_SET = [0xf8b595, 0xf67280, 0xc06c84, 0x6c5b7c]
export default {
  name: 'home',
  data() {
    return {
      pixi: undefined,
      drop: undefined,
      cardSize: 5
    }
  },
  mounted() {
    const container = this.$refs.container
    this.pixi = new PIXI.Application({
      autoResize: true,
      antialias: false,
      transparent: true,
      resolution: 1,
      resizeTo: container
    })
    container.appendChild(this.pixi.view)
    this.drop = new PIXI.ParticleContainer({
      maxSize: AMOUNT
    })
    // Add container to app stage
    this.pixi.stage.addChild(this.drop)
    // Create a base graphic for our sprites
    const p = new PIXI.Graphics()
    p.beginFill(COLOR)
    p.drawCircle(0, 0, 100)
    p.endFill()
    this.pixi.stage.addChild(p)
    // Generate a base texture from the base graphic
    const baseTexture = this.pixi.renderer.generateTexture(p)
    const particles = this.genParticles(baseTexture)
    const ticker = new PIXI.Ticker()
    ticker.add(i => {
      for (const particle of particles) {
        if (particle.y > 0) particle.x += particle.vx * SPEED
        particle.y += particle.vy * SPEED

        if (Math.random() > 0.9) particle.vx = this.update(particle.vx)
        if (Math.random() > 0.9) particle.vy = Math.min(particle.vy + 1, UPPER_LIMIT_Y)
        if (
          particle.x > this.pixi.renderer.width ||
          particle.x < 0 ||
          particle.y > this.pixi.renderer.height
        ) { this.reset(particle) }
      }
      this.pixi.renderer.render(this.drop)
    })
    ticker.start()
  },
  methods: {
    getRandomColor() {
      return COLOR_SET[Math.floor(Math.random() * COLOR_SET.length)]
    },
    floored(v) {
      return Math.floor(Math.random() * v)
    },
    update(p) {
      return Math.random() > 0.5
        ? Math.max(LOWER_LIMIT_X, p - 1)
        : Math.min(p + 1, UPPER_LIMIT_X)
    },
    reset(p) {
      p.x = this.floored(this.pixi.renderer.width)
      p.y = -(p.size + this.floored(this.pixi.renderer.height))
      p.vy = this.floored(UPPER_LIMIT_Y) + 2
    },
    genParticles(t) {
      return new Array(AMOUNT).fill().map(p => {
        const SIZE = this.floored(MAX_SIZE) + MIN_SIZE
        p = new PIXI.Sprite(t)
        p.size = SIZE
        p.vx = this.floored(UPPER_LIMIT_X) - UPPER_LIMIT_X
        p.vy = this.floored(UPPER_LIMIT_Y) + 2
        p.alpha = Math.random()
        p.x = p.startX = this.floored(this.pixi.renderer.width)
        p.y = p.startY = (SIZE + this.floored(this.pixi.renderer.height))
        p.width = p.height = SIZE
        p.tint = this.getRandomColor()
        this.drop.addChild(p)
        return p
      })
    },
    navTo(destination) {
      if (destination === 'readme') {
        this.$router.push('component/README')
      } else if (destination === 'github') {
        this.openWindow('https://www.github.com')
      } else if (destination === 'hdvon') {
        this.openWindow('http://www.hdvon.com/')
      } else {
        this.$router.push({
          name: destination
        })
      }
    },
    openWindow(url, targetType = '_blank') {
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('target', targetType)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.home-wrapper {
    .container {
      height: 500px;
      width: 100%;
      position: relative;
    }
    .info-wrapper {
      width: 400px;
      height: 200px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .card-wrapper {
      margin-top: 30px;
      .card-item {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        height: 200px;
        &:hover {
          background-color: #ecf5ff;
          color: #409EFF;
          h4 {
            color: #409EFF
          }
        }
      }
      .card-item--icon {
        font-size: 48px;
      }
    }
	}
</style>
