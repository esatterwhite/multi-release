'use strict'

module.exports = help

const HELP_TXT = `
multi-release - Release tool for managing node.js based monorepos with semantic-release
  usage: multi-release [options]
  options:
    -h, --help        show help and usage
    -v, --version     show version
    -d, --debug       enables debug output
    -b, --branches    The branches on which releases should happen
    -s, --sequential  runs the releases sequentially rather than concurrently
    -c, --current     filter commits from only the currently checked out branch
    --dry-run         Runs all releases in dry run mode
    --ci, --no-ci     Force semantic-release to run as if it were in a CI environment
`.trim()


function help() {
  return HELP_TXT
}
