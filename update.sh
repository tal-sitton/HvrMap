#!/bin/sh

curl https://www.hvr.co.il/bs2/datasets/company_categories.json \
  -H 'Origin: https://www.hvr.co.il' \
  -H 'Referer: https://www.hvr.co.il/site/pg/maps_hvr' \
  -H 'sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"' \
  -o ./maps_hvr_files/company_categories.json

curl 'https://nodews.hvr.co.il/get_dataset/markers_hvr' \
  -X 'POST' \
  -H 'Origin: https://www.hvr.co.il' \
  -H 'Referer: https://www.hvr.co.il/site/pg/maps_hvr' \
  -H 'sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"' \
  -o ./maps_hvr_files/markers_hvr
