#!/usr/bin/env python3
"""Validate a JSON file and summarize its structure. Python 3.9+, no dependencies.

Usage: python json_inspect.py example.json
Root depth is 0. Each child increases the depth by 1.
"""
import argparse
import json
import sys
from pathlib import Path


def inspect(value):
    keys = items = depth = 0
    stack = [(value, 0)]
    while stack:
        current, level = stack.pop()
        depth = max(depth, level)
        if isinstance(current, dict):
            keys += len(current)
            stack.extend((child, level + 1) for child in current.values())
        elif isinstance(current, list):
            items += len(current)
            stack.extend((child, level + 1) for child in current)
    return keys, items, depth


def type_name(value):
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, dict):
        return "object"
    if isinstance(value, list):
        return "array"
    if isinstance(value, str):
        return "string"
    return "number"


def reject_constant(value):
    raise ValueError(f"Non-standard JSON constant: {value}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=Path, help="UTF-8 JSON file to inspect")
    args = parser.parse_args()
    try:
        with args.file.open(encoding="utf-8-sig") as file:
            value = json.load(file, parse_constant=reject_constant)
        keys, items, depth = inspect(value)
    except (OSError, ValueError, UnicodeError, RecursionError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    print("Valid JSON")
    print(f"Root type: {type_name(value)}")
    print(f"Object keys: {keys}")
    print(f"Array items: {items}")
    print(f"Max depth: {depth}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
