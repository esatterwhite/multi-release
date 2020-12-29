'use strict'

module.exports = {
  branches: ['master']
, plugins: [
    ['@semantic-release/commit-analyzer', {
      parserOpts: {
        noteKeywords: ['BREAKING', 'BREAKING CHANGE', 'BREAKING CHANGES']
      , referenceActions: [
          'close', 'closes', 'closed'
        , 'fix', 'fixes', 'fixed'
        , 'resolve', 'resolves', 'resolved'
        , 'ref', 'Ref'
        ]
      }
    , releaseRules: [
        {type: 'build', release: 'patch'}
      , {type: 'ci', release: 'patch'}
      , {type: 'chore', release: 'patch'}
      , {type: 'refactor', release: 'patch'}
      , {type: 'test', release: 'patch'}
      , {type: 'doc', release: 'patch'}
      , {type: 'perf', release: 'minor'}
      ]
    }],
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
