#!/bin/bash

import os
import subprocess
import shutil

# python3 utils/build-move.py

docs = "web-docs"

subprocess.call("npm run build", cwd=docs, shell=True)

shutil.copytree(f"{docs}/dist/assets", "docs/assets", dirs_exist_ok=True)

shutil.copy(f"{docs}/dist/index.html", "docs")

with open(f"docs/index.html", 'r') as file:
    data = file.read()
    data = data.replace("/assets", "./assets")
  
with open(f"docs/index.html", 'w') as file:
    file.write(data)