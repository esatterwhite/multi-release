'use strict'

const execa = require('execa')

module.exports = push

async function push(cwd, remote = 'origin', branch = 'master') {
  await execa('git', ['push', '--tags', remote, `HEAD:${branch}`], {cwd: cwd})
}
