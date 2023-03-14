import pathlib
import morecantile
from rio_tiler.io import Reader
import rasterio as rio
from rasterio.crs import CRS
import shutil
import os

# python3 utils/raster-tiler.py

intif = "cog-outputs/full-nz/holding/zoom2.tif"
outputdir = "web-docs/tiles"
minzoom = 2
maxzoom = 2
zoom = 3

if os.path.exists(f"{outputdir}/{zoom}"):
	shutil.rmtree(f"{outputdir}/{zoom}")

rio_file = rio.open(intif)
rio_coords = rio_file.bounds
# print(rio_coords)

NZTM = morecantile.tms.get("NZTM2000")

with Reader(intif, tms=NZTM) as src:
	w, s, e, n  = src.bounds

	pathlib.Path(f"{outputdir}/{zoom}").mkdir(parents=True, exist_ok=True)
	print("set ul")
	ul_tile = src.tms.tile(w, n, zoom, truncate=True)
	print("set lr")
	lr_tile = src.tms.tile(e, s, zoom, truncate=True)
	# print(ul_tile.x)
	# print(lr_tile.x)

	minmax = src.tms.minmax(zoom)
	print(minmax)
	print("set extemas")
	extremas = {
		"x": {
		"min": max(ul_tile.x, minmax["x"]["min"]),
		"max": min(lr_tile.x, minmax["x"]["max"]),
		},
		"y": {
		"min": max(ul_tile.y, minmax["y"]["min"]),
		"max": min(lr_tile.y, minmax["y"]["max"]),
		},
	}

	print(extremas)

	for x in range(minmax["x"]["min"], minmax["x"]["max"] + 1):
		pathlib.Path(f"{outputdir}/{zoom}/{x}").mkdir(parents=True, exist_ok=True)

		for y in range(minmax["y"]["min"], minmax["y"]["max"] + 1):
			print("\rzoom {}, tile {},{}".format(zoom, x, y), end='\r')
			try:
				tile = src.tile(x, y, zoom).render(img_format="PNG", compress="DEFLATE")
				with open(f"{outputdir}/{zoom}/{x}/{y}.png", "wb") as f:
					f.write(tile)

			except:
				pass






