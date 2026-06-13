#!/usr/bin/env python3
"""FABLE-02 A11: re-encode the VR Solutions partner gallery images in place to
<=150 KB inline (they're shown as modest inline gallery photos). Caps width and
steps quality down; skips anything already under budget. Strips EXIF.
Run from repo root: python scripts/optimize-vr-gallery.py"""
import os, io, glob
from PIL import Image

DIRP = "public/assets/img/featured"
MAX_KB = 150
MAX_W = 1200

def encode(img, q):
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
    return buf.getvalue()

def fit(im):
    ow, oh = im.size
    for w in [x for x in (MAX_W, int(MAX_W*0.85), int(MAX_W*0.72), int(MAX_W*0.6)) if x <= ow] or [ow]:
        rim = im if w == ow else im.resize((w, round(oh*w/ow)), Image.LANCZOS)
        for q in (82, 78, 74, 70, 66, 62):
            data = encode(rim, q)
            if len(data) <= MAX_KB*1024:
                return data, rim.size, q
    return encode(rim, 62), rim.size, 62  # smallest tried

changed = 0
for p in sorted(glob.glob(os.path.join(DIRP, "vr-solutions-*.jpg"))):
    kb = os.path.getsize(p) / 1024
    if kb <= MAX_KB:
        continue
    im = Image.open(p).convert("RGB")
    ow, oh = im.size
    data, (nw, nh), q = fit(im)
    with open(p, "wb") as f:
        f.write(data)
    print(f"{os.path.basename(p):40} {int(kb)}KB {ow}x{oh} -> {len(data)//1024}KB {nw}x{nh} q{q}")
    changed += 1
print(f"done ({changed} re-encoded)")
