import os
import shutil
import sys

# python3 utils/clean-dirs.py nz-fill-mono

project = sys.argv[1].split("/")[-1]
print(project)

dirs = f"tiles/raster-tiles/{project}"

# list_dirs = os.listdir(dirs)

for dr in os.listdir(dirs):
    for chdir in os.listdir(f"{dirs}/{dr}"):
        if not os.listdir(f"{dirs}/{dr}/{chdir}"):
            print(f"{chdir} is empty")
            shutil.rmtree(f"{dirs}/{dr}/{chdir}")
        else:
            print(f" Skipping: {chdir}")