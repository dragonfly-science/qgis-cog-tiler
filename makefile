# Set up using QGIS 3.28

BASEIMAGE := dragonflyscience/qgis-builds
IMAGE := $(BASEIMAGE):3.22.12.ltr.20221109

docker-local: Dockerfile
	docker build --tag $(BASEIMAGE) . && \
	docker tag $(BASEIMAGE) $(IMAGE)  

tiler: Dockerfile
	xhost + && \
	docker run -it --rm \
	-v $(HOME):/home/$(USER) \
	-v /usr/share/fonts/:/usr/share/fonts/ \
	-v /tmp/.X11-unix:/tmp/.X11-unix  \
    --privileged \
	--network host \
    -e HOME=/work \
	-e DISPLAY=$$DISPLAY \
    -v ${PWD}:/work \
    -w /work \
	$(IMAGE) \
	bash

qgis-local: Dockerfile
	xhost + && \
	docker run -it --rm \
	-v $(HOME):/home/$(USER) \
	-v /usr/share/fonts/:/usr/share/fonts/ \
	-v /tmp/.X11-unix:/tmp/.X11-unix  \
	-e DISPLAY=$$DISPLAY \
	--network host \
	-d \
	$(IMAGE)

image-export:
	python3 utils/image-export.py $(QGISPROJECT) $(SCALES)

create-cog:
	python3 utils/create-cog.py $(SCALES)

build-site:
	python3 utils/build-move.py