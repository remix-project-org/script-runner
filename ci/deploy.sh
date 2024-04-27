#!/bin/bash

set -e
SHA=$(git rev-parse --short --verify HEAD)
git checkout gh-pages
git checkout master -- build/
git checkout master -- package.json
git checkout master -- webpack.config.js
git checkout master -- src/
yarn && NODE_OPTIONS="--max-old-space-size=4096" yarn build
cp -R build/* .
git config user.email "filip.mertens@ethereum.org"
git config user.name "bunsenstraat"
git add .
git commit -m "Built website from {$SHA}."
git push -f origin gh-pages
git checkout master


