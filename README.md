# multi release

Cli wrapper for [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) which allows forwarding additional global options.
The primary target case is for managing the release process of multi / mono repos

## Installation

If you have not already authenticated with the GitHub packages registry for npm
packages, please see the [internal blog post](https://logdna.blogin.co/single-post.php?id=98365) for
details on how to do so. Once that is done, you can install the dependencies by
running:

```shell
$ npm install @codedependant/multi-release --save-dev
```

Expose as an npm script called `release` for consistency.
```javascript
// package.json
{
  "name": "my-mono-repo"
, "version": "0.0.0"
, "scripts": {
    "release": "multi-release"
 }
}
```

## Release Configuration


```javascript
// package.json
{
  "name": "my-mono-repo"
, "version": "0.0.0"
, "workspaces": ["packages/*", "services/my-service"]
, "scripts": {
    "release": "multi-release"
 }
, "release": {
    "branches": ["master", "next"]
  , "extends": "@internal/my-release-config"
  , ...
  }
}
```

## Command Line Options

 The following flags are passed specifically to the multi-release handler prior to execution.

| Flag           | Type    | Description                                                     | Default |
|----------------|---------|-----------------------------------------------------------------|---------|
| `--sequential` | Boolean | Avoid concurrent initialization collisions by running serially  | `false` |
| `--debug`      | Boolean | Output debugging information                                    | `false` |
| `--current`    | Boolean | Apply commit filtering to current branch only                   | `false` |
| `--branches`   | Boolean | The branches on which releases should happen                    |         |
| `--sequential` | Boolean | Run releases sequentially rather than concurrently              | `false` |
| `--dry-run`    | Boolean | Runs all releases in dry run mode                               | `false` |
| `--ci`         | Boolean | Force semantic-release to run as if it were in a CI environment |         |

Any and all command line options will be injected as global options to plugins through the plugin context key
`options`. Additionally, the directory the command was executed from will be injected as **root**. This is done to compensate for the fact that semantic release sets `cwd` to the directory of the package being released during execution.


## Authors

* [**Eric Satterwhite**](mailto:eric.satterwhite@logdna.com) &lt;eric.satterwhite@logdna.com&gt;

