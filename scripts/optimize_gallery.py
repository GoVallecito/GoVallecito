#!/usr/bin/env python3
"""Imagery-expansion optimizer (mirrors optimize_images.py). Reads the gallery
originals from assets-originals/free-images/, writes web copies to
public/assets/img/gallery/ (strip EXIF, no upscale, progressive JPEG within a
size budget). These serve as both the grid thumbs and the lightbox full image,
so ~1100px wide @ <=150KB. Run from repo root: python scripts/optimize_gallery.py"""
import os, io
from PIL import Image

SRC = "assets-originals/free-images"
OUT = "public/assets/img/gallery"
os.makedirs(OUT, exist_ok=True)

# (source, output, target_width_px, max_kb)
JOBS = [
    # Category 1 — Ute heritage (historic, often portrait)
    ("ute-delegation-1880.jpg",        "ute-delegation-1880.jpg",      1100, 150),
    ("ute-wahbegit-1899.jpg",          "ute-wahbegit-1899.jpg",        1000, 150),
    ("ute-sevara-1885.jpg",            "ute-sevara-1885.jpg",          1100, 150),
    ("ute-capote-1875.jpg",            "ute-capote-1875.jpg",          1100, 150),
    ("ute-children-loc.jpg",           "ute-children-loc.jpg",         1100, 150),
    # Category 4 — recreation
    ("rec-ice-lakes-hike.jpg",         "rec-ice-lakes-hike.jpg",       1100, 150),
    ("rec-emerald-lake.jpg",           "rec-emerald-lake.jpg",         1100, 150),
    ("rec-cdt-weminuche.jpg",          "rec-cdt-weminuche.jpg",        1100, 150),
    ("rec-williams-creek-reservoir.jpg","rec-williams-creek-reservoir.jpg",1100,150),
    ("rec-haviland-lake.jpg",          "rec-haviland-lake.jpg",        1100, 150),
    # Category 5 — wild & scenic, wildlife, night sky
    ("wild-weminuche-hills.jpg",       "wild-weminuche-hills.jpg",     1100, 150),
    ("wild-ice-lake-basin.jpg",        "wild-ice-lake-basin.jpg",      1100, 150),
    ("wild-aspen-gold.jpg",            "wild-aspen-gold.jpg",          1100, 150),
    ("wild-weminuche-creek-mouth.jpg", "wild-weminuche-creek-mouth.jpg",1100,150),
    ("wild-bald-eagle.jpg",            "wild-bald-eagle.jpg",          1100, 150),
    ("wild-elk.jpg",                   "wild-elk.jpg",                 1100, 150),
    ("wild-moose.jpg",                 "wild-moose.jpg",               1100, 150),
    ("wild-black-bear.jpg",            "wild-black-bear.jpg",          1100, 150),
    ("wild-bighorn.jpg",               "wild-bighorn.jpg",             1100, 150),
    ("wild-osprey-fish.jpg",           "wild-osprey-fish.jpg",         1100, 150),
    ("wild-milkyway.jpg",              "wild-milkyway.jpg",            1100, 150),
]

def encode(img, q):
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
    return buf.getvalue()

def best_within_budget(base, ow, oh, target_w, max_kb):
    widths = [w for w in (target_w, int(target_w*0.85), int(target_w*0.72)) if w <= ow] or [min(ow, target_w)]
    smallest = None
    for w in widths:
        im = base if w == ow else base.resize((w, round(oh * w / ow)), Image.LANCZOS)
        for q in (82, 78, 74, 70, 66, 62):
            data = encode(im, q)
            if smallest is None or len(data) < smallest[0]:
                smallest = (len(data), data, im.size, q)
            if len(data) <= max_kb * 1024:
                return len(data), data, im.size, q
    return smallest

over = 0
for src, out, w, max_kb in JOBS:
    sp = os.path.join(SRC, src)
    if not os.path.exists(sp):
        print(f"MISSING {src}"); continue
    im = Image.open(sp).convert("RGB")
    ow, oh = im.size
    nb, data, (nw, nh), q = best_within_budget(im, ow, oh, w, max_kb)
    with open(os.path.join(OUT, out), "wb") as f:
        f.write(data)
    flag = "" if nb <= max_kb*1024 else "  !!OVER"
    if nb > max_kb*1024: over += 1
    print(f"{out:34} {ow}x{oh} -> {nw}x{nh}  {nb//1024}KB q{q}{flag}")
print(f"done ({over} over budget)")
