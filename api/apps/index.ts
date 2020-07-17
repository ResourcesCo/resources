import channel, { channelData } from './channel'
import asana from './asana'
import github from './github'
import test from './test'
import random from './random'
import request from './request'

const apps = {
  channel,
  asana,
  github,
  test,
  random,
  request,
}

channelData.apps = apps

export default apps
