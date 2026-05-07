#!/usr/bin/env python3
"""Regenerate data/flashcards.js from data/flashcards.csv.

Usage from repo root:
    python3 tools/csv_to_js.py
"""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "flashcards.csv"
JS_PATH = ROOT / "data" / "flashcards.js"
REQUIRED_COLUMNS = ["Unit", "Type", "Front", "Back", "Extra cue"]


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")[:60]


def main() -> None:
    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        missing = [col for col in REQUIRED_COLUMNS if col not in (reader.fieldnames or [])]
        if missing:
            raise SystemExit(f"Missing required CSV columns: {', '.join(missing)}")

        cards = []
        for index, row in enumerate(reader, start=1):
            unit = row["Unit"].strip()
            front = row["Front"].strip()
            cards.append(
                {
                    "id": f"card-{index:03d}-{slugify(unit + '-' + front)}",
                    "unit": unit,
                    "type": row["Type"].strip(),
                    "front": front,
                    "back": row["Back"].strip(),
                    "cue": row["Extra cue"].strip(),
                }
            )

    JS_PATH.write_text(
        "/* Generated from data/flashcards.csv. Edit the CSV and run tools/csv_to_js.py to regenerate. */\n"
        + "window.YEAR7_FLASHCARDS = "
        + json.dumps(cards, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(cards)} flashcards to {JS_PATH}")


if __name__ == "__main__":
    main()
