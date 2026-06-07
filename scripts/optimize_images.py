#!/usr/bin/env python3
"""Round 19 image optimizer. Reads originals from assets-originals/free-images/,
writes web copies to public/assets/img/ (strip EXIF, no upscale, JPEG q~80 within
a size budget). Run from repo root: python scripts/optimize_images.py"""
import os, io
from PIL import Image

SRC = "assets-originals/free-images"
OUT = "public/assets/img"
os.makedirs(OUT, exist_ok=True)

# (source, output, target_width_px, max_kb)
JOBS = [
    # heroes (1920w, <=350KB)
    ("vallecito-reservoir-beall-ccby4.jpg",        "hero-lake-panorama.jpg",  1920, 350),
    ("vallecito-rec-area-beall-ccby4.jpg",         "hero-shoreline.jpg",      1920, 350),
    ("vallecito-dam-beall-ccby4.jpg",              "hero-dam.jpg",            1920, 350),
    ("vallecito-community-beall-ccby4.jpg",        "hero-community.jpg",      1920, 350),
    ("los-pinos-river-beall-ccby4.jpg",            "hero-los-pinos.jpg",      1920, 350),
    ("vallecito-creek-usfs-pd.jpg",                "hero-vallecito-creek.jpg",1920, 300),
    # inline figures (960w, <=150KB)
    ("vallecito-aerial-lund-ccbysa2.jpg",          "lake-aerial.jpg",          960, 150),
    ("vallecito-star-trails-lee-ccby3.jpg",        "star-trails.jpg",          960, 150),
    ("vallecito-creek-bridge-sfch-ccby3.jpg",      "creek-bridge.jpg",         960, 150),
    ("vallecito-campground-creekside-usfs-pd.jpg", "campground-creek.jpg",     960, 150),
    ("vallecito-creek-1911-usfs-pd.jpg",           "creek-1911.jpg",           960, 150),
    ("weminuche-aspen-pd.jpg",                     "weminuche-aspen.jpg",      960, 150),
]

def encode(img, q):
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
    return buf.getvalue()

def best_within_budget(base, ow, oh, target_w, max_kb):
    """Try descending widths; at each, descending quality (floor 66). Return the
    first encoding under budget; else the smallest produced."""
    widths = [w for w in (target_w, int(target_w*0.85), int(target_w*0.72)) if w <= ow] or [min(ow, target_w)]
    smallest = None
    for w in widths:
        im = base if w == ow else base.resize((w, round(oh * w / ow)), Image.LANCZOS)
        for q in (82, 78, 74, 70, 66):
            data = encode(im, q)
            if smallest is None or len(data) < smallest[0]:
                smallest = (len(data), data, im.size, q)
            if len(data) <= max_kb * 1024:
                return len(data), data, im.size, q
    return smallest

for src, out, w, max_kb in JOBS:
    sp = os.path.join(SRC, src)
    if not os.path.exists(sp):
        print(f"MISSING {src}"); continue
    im = Image.open(sp).convert("RGB")  # strip alpha/EXIF baggage
    ow, oh = im.size
    nb, data, (nw, nh), q = best_within_budget(im, ow, oh, w, max_kb)
    with open(os.path.join(OUT, out), "wb") as f:
        f.write(data)
    flag = "" if nb <= max_kb*1024 else "  !!OVER BUDGET"
    print(f"{out:26} {ow}x{oh} -> {nw}x{nh}  {nb//1024}KB q{q}{flag}")
print("done")
