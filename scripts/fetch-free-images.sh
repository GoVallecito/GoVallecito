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

# ===== Imagery expansion (gallery.html) — all URLs + licenses verified via the
# Wikimedia Commons API (scripts/verify-commons.mjs); see docs/IMAGES-PLAN.md and the
# #photo-credits table on sources.html. PD = public domain; CC BY / CC BY-SA require credit.
# --- Category 1: Ute / Southern Ute heritage (public domain) ---
get "https://upload.wikimedia.org/wikipedia/commons/6/6c/Ute_delegation.jpg"                                            "ute-delegation-1880.jpg"      # Mathew Brady, 1880, PD
get "https://upload.wikimedia.org/wikipedia/commons/5/5c/Wah-be-git_-_Ute_man%2C_half-length_portrait%2C_facing_right%2C_wearing_earring_in_right_ear%2C_with_two_braids_LCCN94509881.jpg" "ute-wahbegit-1899.jpg" # Rose & Hopkins, 1899, LoC PD
get "https://upload.wikimedia.org/wikipedia/commons/6/6f/Chief_Sevara_and_family%2C_ca._1885_-_DPLA_-_c2cf2de92e89e01f976288b59de4aac0.jpg" "ute-sevara-1885.jpg"  # ca.1885, DPLA PD
get "https://upload.wikimedia.org/wikipedia/commons/b/ba/Ute_braves%2C_of_the_Kah-poh-teh_band_-_DPLA_-_2e5f06d0a53f6bb71eab8550af4b9266_%28page_1%29.jpg" "ute-capote-1875.jpg" # T.H. O'Sullivan, 1875, PD
get "https://upload.wikimedia.org/wikipedia/commons/1/1b/Utes._Group_of_children_LOC_ds.10831.jpg"                      "ute-children-loc.jpg"         # Library of Congress, PD
# --- Category 4: the lake today / recreation (CC BY / CC BY-SA) ---
get "https://upload.wikimedia.org/wikipedia/commons/a/a9/Hiking_to_the_Ice_Lakes._San_Juan_National_Forest%2C_Colorado.jpg" "rec-ice-lakes-hike.jpg"    # Paxson Woelber, CC BY-SA 4.0
get "https://upload.wikimedia.org/wikipedia/commons/3/37/Emerald_Lake_%28San_Juan_National_Forest%29%2C_CO.jpg"         "rec-emerald-lake.jpg"         # Penguin314, CC BY-SA 4.0
get "https://upload.wikimedia.org/wikipedia/commons/a/a9/Continental_divide_trail_in_Weminuche_Wilderness.jpg"          "rec-cdt-weminuche.jpg"        # Charlie DeTar, CC BY-SA 3.0
get "https://upload.wikimedia.org/wikipedia/commons/d/d8/Looking_across_Williams_Creek_Reservoir.JPG"                   "rec-williams-creek-reservoir.jpg" # Jeffrey Beall, CC BY 4.0
get "https://upload.wikimedia.org/wikipedia/commons/d/d9/Haviland_Lake_-_panoramio_%281%29.jpg"                         "rec-haviland-lake.jpg"        # Outdoor Craziness, CC BY-SA 3.0
# --- Category 5: wild & scenic, wildlife, night sky (PD federal + CC) ---
get "https://upload.wikimedia.org/wikipedia/commons/b/b2/Weminuche_Wilderness_hills.JPG"                                "wild-weminuche-hills.jpg"     # Delaywaves, CC BY 3.0
get "https://upload.wikimedia.org/wikipedia/commons/e/e4/Ice_Lake_basin%2C_San_Juan_Mountains%2C_Colorado.jpg"          "wild-ice-lake-basin.jpg"      # John Fowler, CC BY 2.0
get "https://upload.wikimedia.org/wikipedia/commons/e/e6/Aspen_Gold.jpg"                                                "wild-aspen-gold.jpg"          # Robert M. Russell, CC BY-SA 4.0
get "https://upload.wikimedia.org/wikipedia/commons/b/b5/The_mouth_of_Weminuche_Creek.JPG"                             "wild-weminuche-creek-mouth.jpg" # Jeffrey Beall, CC BY 4.0
get "https://upload.wikimedia.org/wikipedia/commons/8/8c/USFWS_bald_eagle_%2823770875811%29.jpg"                        "wild-bald-eagle.jpg"          # USFWS, PD
get "https://upload.wikimedia.org/wikipedia/commons/5/55/Rocky_Mountain_Bull_Elk.jpg"                                   "wild-elk.jpg"                 # MONGO, PD (self-release)
get "https://upload.wikimedia.org/wikipedia/commons/8/8b/Moose_superior.jpg"                                            "wild-moose.jpg"               # USDA Forest Service, PD
get "https://upload.wikimedia.org/wikipedia/commons/e/e8/American_black_bear_%2826905320846%29.jpg"                     "wild-black-bear.jpg"          # USFWS/Southeast, PD
get "https://upload.wikimedia.org/wikipedia/commons/0/0f/Rocky_Mountain_Bighorn_Sheep_%28Ovis_canadensis_canadensis%29%2C_Rocky_Mountain_National_Park.jpg" "wild-bighorn.jpg" # dw_ross, CC BY 2.0
get "https://upload.wikimedia.org/wikipedia/commons/0/00/Osprey_with_fish_%2849694356538%29.jpg"                        "wild-osprey-fish.jpg"         # USFWS Northeast, PD
get "https://upload.wikimedia.org/wikipedia/commons/d/d8/Milky_Way_over_Rocky_Mountain_National_Park_%2826367276674%29.jpg" "wild-milkyway.jpg"        # NPS / Jeremy M. White, PD
# NOTE (verify-or-exclude): NO open-licensed 1938–41 Vallecito Dam CONSTRUCTION photo exists online
# (the Maj. C.A. Burns album is held by Fort Lewis College's Center of Southwest Studies — needs a
# direct rights request). NO verifiable angler/kayak action shot (only on Flickr, license unconfirmable).
# Old-Vallecito family photos = Pine River Library (permission pending — David ask). All excluded for now.

# NOT scripted (grab manually): Flickr originals — Lake Fireworks (flickr.com/photos/126818958@N05/28132942275,
# CC BY 2.0, David Kobuszewski) and Three Relics (flickr.com/photos/cogdog/29304303165, CC BY 2.0, Alan Levine) —
# use Flickr's download button for full size. USBR dam aerial: save from usbr.gov/projects/index.php?id=258 (PD).

# ===== Images Round B (docs/IMAGES-ROUND-B.md) — all licenses verified via the
# Commons API (scripts/verify-commons.mjs) + the Flickr page for the kayak. San-Juan/
# Vallecito only. Wildflowers + a boating shot for the gallery; winter + forest-road heroes.
# --- Gallery: San Juan wildflowers + a Vallecito boating shot ---
get "https://upload.wikimedia.org/wikipedia/commons/6/6e/Aquilegia_coerulea_-_Jos%C3%A9_Garrido_01.jpg"        "flower-columbine.jpg"        # José Garrido, CC BY 4.0 — San Juan NF, Dolores Co.
get "https://upload.wikimedia.org/wikipedia/commons/f/f0/East_of_Conejos_Peak_-_Flickr_-_aspidoscelis.jpg"     "flower-paintbrush.jpg"       # Patrick Alexander, CC0 — SE San Juans
get "https://upload.wikimedia.org/wikipedia/commons/7/7e/Pedicularis_groenlandica_-_Zac_Peterson_01.jpg"       "flower-elephantheads.jpg"    # Zac Peterson, CC BY 4.0 — San Juan NF
get "https://upload.wikimedia.org/wikipedia/commons/8/8e/Mertensia_bakeri_-_Flickr_-_aspidoscelis.jpg"          "flower-bluebells.jpg"        # Patrick Alexander, CC0 — SE San Juans
get "https://upload.wikimedia.org/wikipedia/commons/6/67/Wildflowers_in_American_Basin.jpg"                     "flower-american-basin.jpg"   # BLM, CC BY 2.0 — American Basin, San Juans
get "https://live.staticflickr.com/8536/29263472186_55dd52f95e_b.jpg"                                          "today-kayak.jpg"             # Alan Levine (cogdog), CC BY 2.0 — Vallecito Reservoir
# --- Heroes (optimize to 1920w/<=350KB into public/assets/img/) ---
get "https://upload.wikimedia.org/wikipedia/commons/c/cc/Snowing_-_Winter_long_Wolf_Creek_Pass_in_Colorado.jpg" "hero-winter.jpg"            # Corey Leopold, CC BY 2.0 — Wolf Creek Pass, San Juans (winter)
get "https://upload.wikimedia.org/wikipedia/commons/6/62/Subaru_on_the_road_to_Clear_Lake._San_Juan_National_Forest%2C_Colorado_%2827868503841%29.jpg" "hero-forest-road.jpg" # Paxson Woelber, CC BY 2.0 — SJNF forest road

echo; echo "Done. Files in $DIR:"; ls -la "$DIR"
echo "Reminder: resize/optimize before copying into public/assets/img/ (originals are 8–22 MB)."
