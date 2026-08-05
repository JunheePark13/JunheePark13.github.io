from __future__ import annotations

from pathlib import Path

import fitz

PDF_PATH = Path("documents/ODE PINN vs Num Meth.pdf")
HTML_PATH = Path("projects/Brusselator.html")
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


def replace_placeholders() -> None:
    html = HTML_PATH.read_text(encoding="utf-8")
    replacements = {
        '<figure><div class="figure-placeholder"><div><strong>Figure to add: Time-step convergence</strong>Export Figure 1 from page 6 of the final report.</div></div><figcaption>Euler, improved Euler, RK4, and PINN at four time-step sizes.</figcaption></figure>':
            '<figure><img src="../images/pinn-time-step-convergence.png" alt="Time-step convergence comparison for Euler, improved Euler, RK4, and PINN" loading="lazy"><figcaption>Euler, improved Euler, RK4, and PINN at four time-step sizes.</figcaption></figure>',
        '<figure><div class="figure-placeholder"><div><strong>Figure to add: PINN training history</strong>Export Figure 2 from page 7 of the final report.</div></div><figcaption>Total, physics, initial-condition, data, and validation losses.</figcaption></figure>':
            '<figure><img src="../images/pinn-training-history.png" alt="PINN training and validation loss history" loading="lazy"><figcaption>Total, physics, initial-condition, data, and validation losses.</figcaption></figure>',
        '<figure><div class="figure-placeholder"><div><strong>Figure to add: Speed–accuracy tradeoff</strong>Export Figure 3 from page 8 of the final report.</div></div><figcaption>Global runtime versus average MSE.</figcaption></figure>':
            '<figure><img src="../images/pinn-speed-accuracy.png" alt="Global solver speed and accuracy tradeoff" loading="lazy"><figcaption>Global runtime versus average MSE.</figcaption></figure>',
        '<figure><div class="figure-placeholder"><div><strong>Figure to add: Runtime distribution</strong>Export Figure 4 from page 8 of the final report.</div></div><figcaption>Runtime distributions across 5,000 trials.</figcaption></figure>':
            '<figure><img src="../images/pinn-runtime-distribution.png" alt="Runtime distribution across randomized solver trials" loading="lazy"><figcaption>Runtime distributions across 5,000 trials.</figcaption></figure>',
        '<figure><div class="figure-placeholder"><div><strong>Figure to add: Spurious oscillations</strong>Export Figure 5 from page 9 of the final report.</div></div><figcaption>PINN error in a slowly varying regime.</figcaption></figure>':
            '<figure><img src="../images/pinn-spurious-oscillations.png" alt="PINN spurious oscillations in a slowly varying regime" loading="lazy"><figcaption>PINN error in a slowly varying regime.</figcaption></figure>',
        '<figure><div class="figure-placeholder"><div><strong>Figure to add: High-frequency phase error</strong>Export Figure 6 from page 9 of the final report.</div></div><figcaption>PINN deterioration in an oscillatory regime.</figcaption></figure>':
            '<figure><img src="../images/pinn-high-frequency-error.png" alt="PINN phase and amplitude error in a high-frequency regime" loading="lazy"><figcaption>PINN deterioration in an oscillatory regime.</figcaption></figure>',
        'Representative solver comparison. This existing figure is retained until the final report plots are exported individually.':
            'Representative numerical and neural solver comparison.'
    }
    for old, new in replacements.items():
        html = html.replace(old, new)
    HTML_PATH.write_text(html, encoding="utf-8")


def main() -> None:
    if not PDF_PATH.exists():
        raise FileNotFoundError(PDF_PATH)

    OUT_DIR.mkdir(exist_ok=True)
    doc = fitz.open(PDF_PATH)

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

    replace_placeholders()
    print("Extracted six figures and updated the project page.")


if __name__ == "__main__":
    main()
