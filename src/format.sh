#!/bin/bash
cd "$(dirname "$0")"
echo format $(pwd)
yarn prettier --write "**/*.{js,jsx,html,css,scss}"
