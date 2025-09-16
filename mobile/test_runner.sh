#!/bin/zsh

set -euo pipefail

usage() {
  echo "Usage: $0 {all|analyze|unit|widget|coverage|specific <path>}" >&2
  exit 1
}

ensure_tools() {
  command -v flutter >/dev/null 2>&1 || { echo "Flutter is required"; exit 2; }
}

run_analyze() {
  echo "Running Flutter analyze..."
  flutter analyze
  echo "Checking dart format..."
  dart format --set-exit-if-changed .
}

run_unit_tests() {
  echo "Running unit tests..."
  flutter test test/models/ test/services/ test/providers/
}

run_widget_tests() {
  echo "Running widget tests..."
  flutter test test/widgets/ test/screens/
}

generate_coverage() {
  echo "Generating coverage report..."
  flutter test --coverage
  if command -v genhtml >/dev/null 2>&1; then
    genhtml coverage/lcov.info -o coverage/html
    echo "HTML report at coverage/html/index.html"
  else
    echo "genhtml not found; skipping HTML generation"
  fi
}

run_all() {
  run_analyze
  run_unit_tests
  run_widget_tests
  generate_coverage
}

run_specific() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo "Test file not found: $file" >&2
    exit 3
  fi
  flutter test "$file"
}

ensure_tools

case "${1:-}" in
  analyze) run_analyze ;;
  unit) run_unit_tests ;;
  widget) run_widget_tests ;;
  coverage) generate_coverage ;;
  all) run_all ;;
  specific) shift; [ -n "${1:-}" ] || usage; run_specific "$1" ;;
  *) usage ;;
esac


