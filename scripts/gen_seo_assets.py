#!/usr/bin/env python3
"""R21 SEO assets: og-default.jpg (1200x630 from the Beall lake panorama) + a simple
pine/lake favicon (32px) and apple-touch-icon (180px). Run from repo root."""
import os
from PIL import Image, ImageDraw

OUT = "public/assets/img"
os.makedirs(OUT, exist_ok=True)

# --- og-default.jpg: 1200x630 center-crop of the lake panorama original ---
src = "assets-originals/free-images/vallecito-reservoir-beall-ccby4.jpg"
if os.path.exists(src):
    im = Image.open(src).convert("RGB")
    tw, th = 1200, 630
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    rw, rh = round(sw * scale), round(sh * scale)
    im = im.resize((rw, rh), Image.LANCZOS)
    left, top = (rw - tw) // 2, (rh - th) // 2
    im = im.crop((left, top, left + tw, top + th))
    for q in (84, 80, 76, 72):
        im.save(os.path.join(OUT, "og-default.jpg"), "JPEG", quality=q, optimize=True, progressive=True)
        if os.path.getsize(os.path.join(OUT, "og-default.jpg")) <= 200 * 1024:
            break
    print("og-default.jpg", im.size, os.path.getsize(os.path.join(OUT, "og-default.jpg")) // 1024, "KB")
else:
    print("MISSING panorama original — run scripts/fetch-free-images.sh first")

# --- favicon mark: pine background, teal lake band, white mountains ---
def make_icon(size):
    s = 180
    img = Image.new("RGB", (s, s), (29, 59, 47))      # --pine
    d = ImageDraw.Draw(img)
    d.rectangle([0, int(s*0.66), s, s], fill=(47, 125, 138))   # --lake band (water)
    # two mountains (white) sitting on the waterline
    wl = int(s*0.66)
    d.polygon([(int(s*0.05), wl), (int(s*0.42), int(s*0.20)), (int(s*0.62), wl)], fill=(244, 239, 228))
    d.polygon([(int(s*0.40), wl), (int(s*0.72), int(s*0.30)), (int(s*0.98), wl)], fill=(223, 230, 225))
    # small snow cap accent on the tall peak
    d.polygon([(int(s*0.36), int(s*0.30)), (int(s*0.42), int(s*0.20)), (int(s*0.49), int(s*0.30))], fill=(255,255,255))
    if size != s:
        img = img.resize((size, size), Image.LANCZOS)
    return img

make_icon(32).save(os.path.join(OUT, "favicon-32.png"), "PNG", optimize=True)
make_icon(180).save(os.path.join(OUT, "apple-touch-icon.png"), "PNG", optimize=True)
print("favicon-32.png + apple-touch-icon.png written")
print("done")
