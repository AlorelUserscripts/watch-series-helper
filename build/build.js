const {dirname, join} = require('path');
const fs = require('fs');
const YAML = require('yamljs');

const root = dirname(require.resolve('../package.json'));

function wrap(contents) {
  return `(function(){${contents}})();`
}

function buildMetadata(things) {
  let out = [
    '// ==UserScript=='
  ];

  const doPush = (key, value) => {
    out.push(`// @${key} ${value}`);
  };

  for (const key of Object.keys(things)) {
    if (Array.isArray(things[key])) {
      for (const value of things[key]) {
        doPush(key, value);
      }
    } else {
      doPush(key, things[key]);
    }
  }

  out.push('// ==/UserScript==', '');

  return out.join('\n');
}

function build() {
  const contents = wrap(fs.readFileSync(join(root, 'watch-series-helper.raw.js'), 'utf8'));
  const spec = YAML.parse(fs.readFileSync(join(root, 'spec.yml'), 'utf8'));

  const homepage = `https://github.com/${spec.user}/${spec.repo}`;
  const rawUrl = `https://raw.githubusercontent.com/${spec.user}/${spec.repo}/master`;

  const base = {
    downloadURL: `${rawUrl}/watch-series-helper.user.js`,
    updateURL: `${rawUrl}/watch-series-helper.meta.js`
  };

  const metablock = buildMetadata(Object.assign(
    {},
    base,
    spec.meta
  ));

  const userBlock = buildMetadata(Object.assign(
    {
      homepage,
      supportURL: `${homepage}/issues`,
      icon: `${rawUrl}/favicon.ico`
    },
    base,
    spec.meta,
    spec.block
  ));

  fs.writeFileSync(join(root, 'watch-series-helper.meta.js'), metablock);
  fs.writeFileSync(
    join(root, 'watch-series-helper.user.js'),
    `${userBlock}\n${contents}\n`
  )
}

build();