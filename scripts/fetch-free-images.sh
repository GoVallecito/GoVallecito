#!/usr/bin/env bash
# Fetch verified freely-licensed Vallecito images (see docs/FREE-IMAGES-VALLECITO.md for licenses/credits).
# Originals land in assets-originals/free-images/ (NOT in public/ — resize/optimize before placing on the site).
# Run from the repo root:  bash scripts/fetch-free-images.sh
set -e
DIR="assets-originals/free-images"
mkdir -p "$DIR"
get () { echo "→ $2"; curl -sSL --fail -o "$DIR/$2" "$1" && echo "   ok"; }

# Tier 1 — Jeffrey Beall, CC BY 4.0 (credit required: "Photo: Jeffrey Beall, CC BY 4.0")
get "https://upload.wikimedia.org/wikipedia/commons/f/f8/Vallecito_Reservoir.JPG"                          "vallecito-reservoir-beall-ccby4.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/c/c6/Vallecito_Reservoir_Recreation_Area.JPG"          "vallecito-rec-area-beall-ccby4.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/8/82/Vallecito_Dam.JPG"                                "vallecito-dam-beall-ccby4.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/a/a1/Vallecito%2C_Colorado.JPG"                        "vallecito-community-beall-ccby4.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/c/c1/Los_Pinos_River.JPG"                              "los-pinos-river-beall-ccby4.jpg"

# Tier 1 — other CC (credit required, license in filename)
get "https://upload.wikimedia.org/wikipedia/commons/f/f5/Vallecito_Reservoir%2C_Colorado_%2814311696729%29.jpg" "vallecito-aerial-lund-ccbysa2.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/5/5b/Vallecito_Star_Trails_%2843671354%29.jpeg"        "vallecito-star-trails-lee-ccby3.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/f/f2/Vallecito_Creek_Trail_First_Bridge_-_panoramio.jpg" "vallecito-creek-bridge-sfch-ccby3.jpg"

# Tier 2 — public domain (USFS / released-PD)
get "https://www.fs.usda.gov/sites/nfs/files/legacy-media/sanjuan/20160709_FS_0001_Vallecito%20Creek_1.jpg" "vallecito-creek-usfs-pd.jpg"
get "https://www.fs.usda.gov/sites/nfs/files/r02/sanjuan/image/20240602_FS_mdefries_VallecitoCG-CampingSpotByCreek.JPG" "vallecito-campground-creekside-usfs-pd.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/b/be/19111xxxx-fs-sanjuan-sr-98286_40263560381_o_39962127004_o_%2848902886976%29.jpg" "vallecito-creek-1911-usfs-pd.jpg"
get "https://upload.wikimedia.org/wikipedia/commons/5/5f/Weminuche_Wilderness_Aspen_2010.jpg"              "weminuche-aspen-pd.jpg"

# NOT scripted (grab manually): Flickr originals — Lake Fireworks (flickr.com/photos/126818958@N05/28132942275,
# CC BY 2.0, David Kobuszewski) and Three Relics (flickr.com/photos/cogdog/29304303165, CC BY 2.0, Alan Levine) —
# use Flickr's download button for full size. USBR dam aerial: save from usbr.gov/projects/index.php?id=258 (PD).

echo; echo "Done. Files in $DIR:"; ls -la "$DIR"
echo "Reminder: resize/optimize before copying into public/assets/img/ (originals are 8–22 MB)."
