from __future__ import annotations

from pathlib import Path

import fitz

PDF_PATH = Path("documents/ODE PINN vs Num Meth.pdf")
OUT_DIR = Path("images")
SCALE = 3.0


def image_blocks(page: fitz.Page) -> list[fitz.Rect]:
    blocks = page.get_text("dict").get("blocks", [])
    rects: list[fitz.Rect] = []
    for block in blocks:
        if block.get("type") != 1:
            continue
        rect = fitz.Rect(block["bbox"])
        if rect.width >= 80 and rect.height >= 50:
            rects.append(rect)
    return sorted(rects, key=lambda r: (r.y0, r.x0))


def save_clip(page: fitz.Page, rect: fitz.Rect, filename: str, padding: float = 3.0) -> None:
    clip = fitz.Rect(
        max(page.rect.x0, rect.x0 - padding),
        max(page.rect.y0, rect.y0 - padding),
        min(page.rect.x1, rect.x1 + padding),
        min(page.rect.y1, rect.y1 + padding),
    )
    pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), clip=clip, alpha=False)
    pix.save(OUT_DIR / filename)


def union(rects: list[fitz.Rect]) -> fitz.Rect:
    merged = fitz.Rect(rects[0])
    for rect in rects[1:]:
        merged |= rect
    return merged


def main() -> None:
    if not PDF_PATH.exists():
        raise FileNotFoundError(PDF_PATH)

    OUT_DIR.mkdir(exist_ok=True)
    doc = fitz.open(PDF_PATH)

    # Physical PDF pages 6-9 contain Figures 1-6.
    page6 = doc[5]
    blocks6 = image_blocks(page6)
    if not blocks6:
        raise RuntimeError("No image blocks found on PDF page 6")
    save_clip(page6, union(blocks6), "pinn-time-step-convergence.png")

    page7 = doc[6]
    blocks7 = image_blocks(page7)
    if not blocks7:
        raise RuntimeError("No image blocks found on PDF page 7")
    save_clip(page7, max(blocks7, key=lambda r: r.get_area()), "pinn-training-history.png")

    page8 = doc[7]
    blocks8 = sorted(image_blocks(page8), key=lambda r: r.y0)
    if len(blocks8) < 2:
        raise RuntimeError(f"Expected two image blocks on PDF page 8, found {len(blocks8)}")
    save_clip(page8, blocks8[0], "pinn-speed-accuracy.png")
    save_clip(page8, blocks8[-1], "pinn-runtime-distribution.png")

    page9 = doc[8]
    blocks9 = sorted(image_blocks(page9), key=lambda r: r.y0)
    if len(blocks9) < 2:
        raise RuntimeError(f"Expected two image blocks on PDF page 9, found {len(blocks9)}")
    save_clip(page9, blocks9[0], "pinn-spurious-oscillations.png")
    save_clip(page9, blocks9[-1], "pinn-high-frequency-error.png")

    print("Extracted six figures from the final report.")


if __name__ == "__main__":
    main()
