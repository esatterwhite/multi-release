'use strict'

const COMMIT_TYPES = new Map([
  ['feat', 'Features']
, ['fix', 'Bug Fixes']
, ['perf', 'Performance Improvements']
, ['revert', 'Reverts']
, ['doc', 'Documentation']
, ['style', 'Style']
, ['lint', 'Lint']
, ['refactor', 'Code Refactoring']
, ['test', 'Tests']
, ['build', 'Build System']
, ['ci', 'Continuous Integration']
, ['chore', 'Chores']
, ['default', 'Miscellaneous']
])

function typeOf(type) {
  return COMMIT_TYPES.get(type) || COMMIT_TYPES.get('default')
}

function transform(commit) {
  commit.type = typeOf(commit.type)
  commit.shortHash = commit.hash.substring(0, 7)
  return commit
}

module.exports = {
  branches: ['main']
, parserOpts: {
    noteKeywords: ['BREAKING', 'BREAKING CHANGE', 'BREAKING CHANGES']
  , referenceActions: [
      'close', 'closes', 'closed'
    , 'fix', 'fixes', 'fixed'
    , 'resolve', 'resolves', 'resolved'
    , 'ref', 'Ref'
    ]
  }
, writerOpts: {transform}
, releaseRules: [
    {type: 'build', release: 'patch'}
  , {type: 'ci', release: 'patch'}
  , {type: 'chore', release: 'patch'}
  , {type: 'refactor', release: 'patch'}
  , {type: 'test', release: 'patch'}
  , {type: 'doc', release: 'patch'}
  , {type: 'perf', release: 'minor'}
  ]
, plugins: [
    ['@semantic-release/commit-analyzer', null],
  , ['@semantic-release/release-notes-generator', null]
  , ['@semantic-release/changelog', {
      changelogTitle: '# Changlog'
    , changelogFile: 'CHANGELOG.md'
    }]
  , ['@semantic-release/npm', {
      tarballDir: 'dist'
    , npmPublish: true
    }]
  , ['@semantic-release/git', {
      assets: [
        'package.json'
      , 'package-lock.json'
      , 'CHANGELOG.md'
      ]
    }]
  , ['@semantic-release/github', {
      assets: 'dist/*.tgz'
    }]
  ]
}
