import os
import shutil

# python3 utils/clean-dirs.py

dirs = "tiles/raster-tiles"

# list_dirs = os.listdir(dirs)

for dr in os.listdir(dirs):
    for chdir in os.listdir(f"{dirs}/{dr}"):
        if not os.listdir(f"{dirs}/{dr}/{chdir}"):
            print(f"{chdir} is empty")
            shutil.rmtree(f"{dirs}/{dr}/{chdir}")
        else:
            print(f" Skipping: {chdir}")