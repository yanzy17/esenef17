#!/usr/bin/env python3
"""Buat file ZIP download Digital Seller OS dari file project non-binary.

Jalankan:
    python create-download-zip.py

Output:
    Digital-Seller-OS.zip
"""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

PROJECT_FOLDER = "Digital Seller OS"
OUTPUT_ZIP = Path("Digital-Seller-OS.zip")

REQUIRED_FILES = [
    Path("README.md"),
    Path("notion-template.md"),
    Path("import-guide.md"),
    Path("sales-page-copy.md"),
    Path("bonus-prompts.md"),
    Path("csv/produk-digital.csv"),
    Path("csv/ide-produk.csv"),
    Path("csv/content-planner.csv"),
    Path("csv/hook-library.csv"),
    Path("csv/cta-library.csv"),
    Path("csv/affiliate-tracker.csv"),
    Path("csv/order-testimoni.csv"),
    Path("csv/income-tracker.csv"),
    Path("csv/prompt-ai-library.csv"),
    Path("csv/action-plan-30-hari.csv"),
    Path("assets/cover-text.md"),
    Path("assets/product-names.md"),
    Path("assets/tagline.md"),
    Path("assets/page-structure.md"),
]


def main() -> None:
    missing = [str(path) for path in REQUIRED_FILES if not path.exists()]
    if missing:
        raise SystemExit("File wajib belum ada:\n- " + "\n- ".join(missing))

    with ZipFile(OUTPUT_ZIP, "w", ZIP_DEFLATED) as archive:
        for path in REQUIRED_FILES:
            archive.write(path, Path(PROJECT_FOLDER) / path)

    with ZipFile(OUTPUT_ZIP) as archive:
        bad_file = archive.testzip()
        if bad_file is not None:
            raise SystemExit(f"ZIP gagal divalidasi. File bermasalah: {bad_file}")

    print(f"Berhasil membuat {OUTPUT_ZIP} berisi {len(REQUIRED_FILES)} file.")


if __name__ == "__main__":
    main()
