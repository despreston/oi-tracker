#!/bin/bash

set -e

echo 'Installing npm packages...'
npm install && echo 'NPM packages installed' || echo 'Failed: npm install'

rm -rf dist
rm -rf .cache

parcel build www/index.html
