#!/usr/bin/env bash

set -e

# Default TEST_EXITCODE
TEST_EXITCODE=0

# Start necessary services
npx ganache &
yarn serve_remix_live &
yarn serve_script_runner &
sleep 10

# Check if a specific test is provided with --test argument
if [[ "$1" == "--test" && -n "$2" ]]; then
    TEST_NAME=$2
    echo "Running specific test: $TEST_NAME"
    yarn build:e2e && yarn nightwatch --test $TEST_NAME --config dist/nightwatch.js || TEST_EXITCODE=1
else
    echo "Running all tests"
    yarn build:e2e && yarn nightwatch --config dist/nightwatch.js || TEST_EXITCODE=1
fi

# Output the exit code
echo "$TEST_EXITCODE"

# Handle exit code
if [ "$TEST_EXITCODE" -eq 1 ]; then
  exit 1
fi
