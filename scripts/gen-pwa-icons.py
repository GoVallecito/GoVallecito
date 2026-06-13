#!/usr/bin/env python3
"""PWA icons: icon-192.png + icon-512.png (maskable), reusing the same pine/lake/
mountain mark as the favicon (scripts/gen_seo_assets.py). Run from repo root."""
import os
from PIL import Image, ImageDraw

OUT = "public/assets/img"
os.makedirs(OUT, exist_ok=True)

def make_icon(size):
    s = 512
    img = Image.new("RGB", (s, s), (29, 59, 47))                 # --pine
    d = ImageDraw.Draw(img)
    d.rectangle([0, int(s*0.66), s, s], fill=(47, 125, 138))     # lake band
    wl = int(s*0.66)
    d.polygon([(int(s*0.05), wl), (int(s*0.42), int(s*0.20)), (int(s*0.62), wl)], fill=(244, 239, 228))
    d.polygon([(int(s*0.40), wl), (int(s*0.72), int(s*0.30)), (int(s*0.98), wl)], fill=(223, 230, 225))
    d.polygon([(int(s*0.36), int(s*0.30)), (int(s*0.42), int(s*0.20)), (int(s*0.49), int(s*0.30))], fill=(255,255,255))
    if size != s:
        img = img.resize((size, size), Image.LANCZOS)
    return img

for sz in (192, 512):
    make_icon(sz).save(os.path.join(OUT, f"icon-{sz}.png"), "PNG", optimize=True)
    print(f"icon-{sz}.png written")
print("done")
