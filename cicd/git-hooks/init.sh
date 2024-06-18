#!/bin/bash
set -e

script_path=$(readlink -f "${BASH_SOURCE[0]}")
script_dir=$(dirname "$script_path")

git config core.hooksPath "$script_dir"