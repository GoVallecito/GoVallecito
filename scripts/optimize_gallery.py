#!/usr/bin/env python3
"""Images Round B optimizer (mirrors optimize_images.py). Reads originals from
assets-originals/free-images/, writes web copies under public/assets/img/.
Gallery images -> gallery/ (~1100px, <=150KB); page heroes -> img root
(~1920px, <=350KB). Strip EXIF, no upscale, progressive JPEG within budget.
Run from repo root: python scripts/optimize_gallery.py
(Round A's 21 gallery images were produced earlier and are unchanged.)"""
import os, io
from PIL import Image

SRC = "assets-originals/free-images"
OUT = "public/assets/img"
os.makedirs(os.path.join(OUT, "gallery"), exist_ok=True)

# (source, output-relative-to-OUT, target_width_px, max_kb)
JOBS = [
    # Gallery — San Juan wildflowers + a Vallecito boating shot
    ("flower-columbine.jpg",       "gallery/flower-columbine.jpg",       1100, 150),
    ("flower-paintbrush.jpg",      "gallery/flower-paintbrush.jpg",      1100, 150),
    ("flower-elephantheads.jpg",   "gallery/flower-elephantheads.jpg",   1100, 150),
    ("flower-bluebells.jpg",       "gallery/flower-bluebells.jpg",       1100, 150),
    ("flower-american-basin.jpg",  "gallery/flower-american-basin.jpg",  1100, 150),
    ("today-kayak.jpg",            "gallery/today-kayak.jpg",            1100, 150),
    # Page heroes (full-bleed banners)
    ("hero-winter.jpg",            "hero-winter.jpg",                    1920, 350),
    ("hero-forest-road.jpg",       "hero-forest-road.jpg",               1920, 350),
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
