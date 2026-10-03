#!/usr/bin/env bash
# Exporta una pieza con transparencia en ProRes 4444, WebM VP9 y secuencia PNG.
# Uso: scripts/render.sh <NN> <pieza> <formato> <version> <datos.json> [composicion]
# Ej.: scripts/render.sh 01 lowerthird 9x16 v1 datos/01-lower-third.ejemplo.json
# [composicion] sirve cuando el nombre de archivo difiere del id de la composición
# (variantes): scripts/render.sh 02 preciorebaja 9x16 v1 datos/02-precio.rebaja.json precio
set -euo pipefail

NN=$1 PIEZA=$2 FORMATO=$3 VERSION=$4 DATOS=$5
COMP="${NN}-${6:-$PIEZA}-${FORMATO}"
BASE="out/${NN}_${PIEZA}_${FORMATO}_${VERSION}"

npx remotion render "$COMP" "${BASE}.mov" --props="$DATOS" \
  --codec=prores --prores-profile=4444 \
  --image-format=png --pixel-format=yuva444p10le

npx remotion render "$COMP" "${BASE}.webm" --props="$DATOS" \
  --codec=vp9 --image-format=png --pixel-format=yuva420p

npx remotion render "$COMP" "${BASE}_png" --props="$DATOS" \
  --sequence --image-format=png
