'use strict'

const path = require('path')
const os = require('os')
const {promises: fs} = require('fs')
const execa = require('execa')

module.exports = initRemote

async function initRemote() {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), path.sep))
  await execa('git', ['init', '--bare'], {cwd: cwd})
  return `file://${cwd}`
}
