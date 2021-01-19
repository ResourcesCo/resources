import channel from './channel'
import asana from './asana'
import github from './github'
import gitlab from './gitlab'
import test from './test'
import random from './random'
import request from './request'
import giphy from './giphy'
import themes from './themes'
import consoleDev from './console-dev'

const apps = {
  channel,
  asana,
  github,
  gitlab,
  test,
  random,
  request,
  giphy,
  themes,
  consoleDev,
}

export const apiOnlyApps = {
  request,
}

export default apps
