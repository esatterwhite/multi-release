'use strict'

const path = require('path')
const {promises: fs} = require('fs')
const execa = require('execa')
const {test, threw} = require('tap')
const git = require('../common/git/index.js')
const pkg = require('../../package.json')

const cmd = path.join(__dirname, '..', '..', 'bin', 'cli.js')
const help = require('../../lib/help.js')

const stringify = JSON.stringify

test('multi-release', async (t) => {
  const cwd = t.testdir({
    'package.json': stringify({
      name: 'service-meta-package'
    , version: '0.0.0-development'
    , workspaces: ['packages/*']
    , release: {
        noCi: true
      , branches: ['main']
      , plugins: [
          '@semantic-release/commit-analyzer'
        , '@semantic-release/release-notes-generator'
        , '@semantic-release/git'
        ]
      }
    })
  , 'packages': {
      a: {
        'package.json': stringify({
          name: 'msr-test-a'
        , version: '0.0.0'
        , peerDependencies: {
            'msr-test-c': '*'
          , 'left-pad': 'latest'
          }
        })
      }
    , b: {
        'package.json': stringify({
          name: 'msr-test-b'
        , version: '0.0.0'
        , dependencies: {
            'msr-test-a': '*'
          }
        , devDependencies: {
            'msr-test-c': '*'
          , 'left-pad': 'latest'
          }
        })
      }
    , c: {
        'package.json': stringify({
          name: 'msr-test-c'
        , version: '0.0.0'
        , devDependencies: {
            'msr-test-b': '*'
          , 'msr-test-d': '*'
          }
        })
      }
    , d: {
        'package.json': stringify({
          name: 'msr-test-d'
        , version: '0.0.0'
        })
      }
    }
  })

  t.test('initial release releases all packages', async (t) => {
    await git.init(cwd)
    await git.add(cwd)
    await git.commit(cwd, 'feat: initial release')

    const origin = await git.initOrigin(cwd)
    t.comment(`repository: ${cwd}`)
    t.comment(`origin: ${origin}`)

    const {stdout} = await execa('node', [
      cmd
    , '--debug'
    , '--sequential'
    , `--repositoryUrl=${origin}`], {
      cwd: cwd
    , extendEnv: false
    , env: {
        BRANCH_NAME: 'main'
      , CI_BRANCH: 'main'
      , CI: 'false'
      , GITHUG_REF: 'refs/heads/main'
      , PWD: process.env.PWD
      , DEBUG: process.env.DEBUG
      , PATH: process.env.PATH
      , HOME: process.env.HOME
      , USER: process.env.USER
      }
    })

    t.match(stdout, /released 4 of 4 packages, semantically/gi, 'all packages released')
    const tags = await git.tags(cwd)
    t.deepEqual(tags, [
      'msr-test-a@1.0.0'
    , 'msr-test-b@1.0.0'
    , 'msr-test-c@1.0.0'
    , 'msr-test-d@1.0.0'
    ], 'release tags added to all projects')
  })

  t.test('--help flag returns help text', async (t) => {
    const {stdout} = await execa('node', [cmd, '--help'], {cwd: cwd})
    t.equal(stdout.trim(), help())
  })

  t.test('no workspaces defined', async (t) => {
    const dir = t.testdir({
      'package.json': JSON.stringify({
        name: 'workspace-pkg'
      , version: '0.0.0'
      , dependencies: {}
      })
    })
    t.rejects(
      execa('node', [cmd], {cwd: dir})
    , /project must contain one or more workspace-packages/gi
    )
  })

  t.test('version flag', async (t) => {
    const {stdout} = await execa('node', [cmd, '--version'], {cwd: cwd})
    t.equal(stdout, pkg.version)
  })

}).catch(threw)

test('selective release', async (t) => {
  const state = {cwd: null, origin: null}
  state.cwd = t.testdir({
    'package.json': stringify({
      name: 'service-meta-package'
    , version: '0.0.0-development'
    , workspaces: ['services/*']
    , release: {
        noCi: true
      , branches: ['main']
      , plugins: [
          '@semantic-release/commit-analyzer'
        , '@semantic-release/release-notes-generator'
        , '@semantic-release/git'
        ]
      }
    })
  , 'services': {
      'first-service': {
        'package.json': stringify({
          'name': 'first-service'
        , 'version': '0.0.0'
        , 'private': true
        })
      }
    , 'second-service': {
        'package.json': stringify({
          'name': 'second-service'
        , 'version': '0.0.0'
        , 'private': true
        })
      }
    }
  })

  t.test('initial release', async (t) => {
    const cwd = state.cwd
    await git.init(cwd)
    await git.add(cwd)
    await git.commit(cwd, 'feat: initial release')

    const origin = await git.initOrigin(cwd)
    state.origin = origin
    t.comment(`repository: ${cwd}`)
    t.comment(`origin: ${origin}`)
    await git.push(cwd)

    const {stdout} = await execa('node', [cmd, `--repositoryUrl=${origin}`], {
      cwd: cwd
    , extendEnv: false
    , env: {
        BRANCH_NAME: 'main'
      , CI_BRANCH: 'main'
      , CI: 'false'
      , GITHUG_REF: 'refs/heads/main'
      , PWD: process.env.PWD
      , DEBUG: process.env.DEBUG
      , PATH: process.env.PATH
      , HOME: process.env.HOME
      , USER: process.env.USER
      }
    })
    t.match(stdout, /released 2 of 2 packages, semantically/gi)
    const tags = await git.tags(cwd)
    t.deepEqual(tags, [
      'first-service@1.0.0'
    , 'second-service@1.0.0'
    ], 'expected release tags')
  })

  t.test('release updated package', async (t) => {
    const {origin, cwd} = state
    const file_path = path.join(cwd, 'services', 'second-service', 'file.txt')
    await fs.writeFile(file_path, 'hello world')
    await git.add(cwd)
    await git.commit(cwd, 'feat: adding new datafile')

    const {stdout} = await execa('node', [cmd, `--repositoryUrl=${origin}`], {
      cwd: cwd
    , extendEnv: false
    , env: {
        BRANCH_NAME: 'main'
      , CI_BRANCH: 'main'
      , CI: 'false'
      , PWD: process.env.PWD
      , DEBUG: process.env.DEBUG
      , PATH: process.env.PATH
      , HOME: process.env.HOME
      , USER: process.env.USER
      }
    })

    t.match(stdout, /released 1 of 2 packages, semantically/gi, '1 package released')
    await git.push(cwd)
    const tags = await git.tags(cwd)
    t.deepEqual(tags, [
      'first-service@1.0.0'
    , 'second-service@1.0.0'
    , 'second-service@1.1.0'
    ], 'expected release tags')
  })
})
