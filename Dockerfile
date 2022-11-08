FROM debian:bullseye-slim

ENV LANG=en_EN.UTF-8

RUN apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests --allow-unauthenticated -y \
        gnupg \
        software-properties-common \
        wget \
    && mkdir -m755 -p /etc/apt/keyrings \
    && wget -O /etc/apt/keyrings/qgis-archive-keyring.gpg https://download.qgis.org/downloads/qgis-archive-keyring.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/qgis-archive-keyring.gpg] https://qgis.org/debian bullseye main" | tee /etc/apt/sources.list.d/qgis.list \
    && apt-get update \
    && apt install --no-install-recommends --no-install-suggests --allow-unauthenticated -y \
        python3-qgis \
        qgis \
        qgis-plugin-grass

RUN apt-get install --no-install-recommends --no-install-suggests --allow-unauthenticated -y saga

RUN apt-get install --no-install-recommends --no-install-suggests --allow-unauthenticated -y python3-pip

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir geopandas

RUN apt-get install --no-install-recommends --no-install-suggests --allow-unauthenticated -y make

CMD ["qgis"]