#!/usr/bin/env node
'use strict'

const debug = require('debug')
const nopt = require('nopt')
const multiSemanticRelease = require('multi-semantic-release/lib/multiSemanticRelease')
const getWorkspaces = require('multi-semantic-release/lib/getWorkspacesYarn')
const multipkg = require('multi-semantic-release/package.json')
const semanticpkg = require('semantic-release/package.json')
const pkg = require('../package.json')
const help = require('../lib/help.js')

const flags = {
  'help': Boolean
, 'debug': Boolean
, 'sequential': Boolean
, 'version': Boolean
, 'current': Boolean
, 'dry-run': Boolean
, 'ci': Boolean
, 'branches': [String, Array]
}

const shorthand = {
  h: ['--help']
, s: ['--sequential']
, v: ['--version']
, d: ['--debug']
, c: ['--current']
, b: ['--branches']
}
const parsed = nopt(flags, shorthand)

if (parsed.help) return console.log(help())
if (parsed.version) return console.log(pkg.version)
if (parsed.debug) debug.enable('msr:*')

const cwd = process.cwd()
const paths = getWorkspaces(cwd)

;(async () => {
  console.log(`multi-release version: ${pkg.version}`)
  console.log(`multi-semantic-release version: ${multipkg.version}`)
  console.log(`semantic-release version: ${semanticpkg.version}`)

  const opts = {cwd: cwd}
  const initial = {
    root: process.cwd()
  , ...parsed
  }

  const input = {
    sequentialInit: parsed.sequential
  , debug: parsed.debug
  , deps: {}
  , dryRun: !!parsed['dry-run']
  }

  await multiSemanticRelease(paths, initial, opts, input)
})().catch(onError)

/* istanbul ignore next */
function onError(err) {
  console.error(err)
  process.exitCode = 1
}
