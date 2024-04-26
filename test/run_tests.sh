#!/usr/bin/env bash

set -e

TEST_EXITCODE=0
npx ganache &
yarn serve_remix_live &
yarn serve_script_runner &
sleep 10

yarn build:e2e && yarn nightwatch --config dist/nightwatch.js || TEST_EXITCODE=1

echo "$TEST_EXITCODE"
if [ "$TEST_EXITCODE" -eq 1 ]
then
  exit 1
fi