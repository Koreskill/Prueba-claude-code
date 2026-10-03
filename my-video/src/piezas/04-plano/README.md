# 04 · Plano que se dibuja (blueprint draw-on)

Explica la distribución antes o después del recorrido. Dura 6 s, pantalla completa.

## Datos

- `{{SUP_TOTAL}}` → prop `SUP_TOTAL`.
- El plano está en `plano.ts`, vectorizado en metros: perímetro exterior en orden desde el acceso, tabiques ya cortados en los vanos, puertas (bisagra, hoja y ángulos), y ambientes con zona (`social`, `dormitorios`, `servicio`). Si el plano llega en PDF, se redibujan los muros ahí como trazos; nunca se importa la imagen.
- `estilo`: `sobreVideo` (navy 70 % + desenfoque 24 px sobre el video) o `portada` (línea fina blanca sobre navy sólido, para cierre o portada).

```bash
scripts/render.sh 04 plano 9x16 v1 datos/04-plano.ejemplo.json
scripts/render.sh 04 planoportada 9x16 v1 datos/04-plano.portada.json plano
```

## Diseño

- Plano de 880 px de ancho (o menos si el alto no entra en la zona segura), centrado junto con la leyenda.
- Muros exteriores crema 6 px con esquinas en inglete; tabiques 4 px; puertas con hoja y arco dorados de 3 px. En portada: 3 / 2 / 2 px y muros blancos.
- Rellenos al 12 %: social dorado #C9A24D, dormitorios champaña #E6CD8F, servicio bronce #A8823A.
- Nombres de ambiente con la píldora de la pieza 06 al 78 % de tamaño (texto de 28 px), en el centroide de cada ambiente o en `etiqueta` si se define.
- Leyenda "{{SUP_TOTAL}} m² totales" en Inter 32 px.

## Movimiento

| Tiempo | Acción                                                                       | Curva   |
| ------ | ---------------------------------------------------------------------------- | ------- |
| 0,00 s | Fondo oscurece (400 ms)                                                      | Suave   |
| 0,30 s | Muros exteriores se trazan siguiendo el perímetro desde el acceso (1,6 s)    | Suave   |
| 1,60 s | Tabiques de a uno, del más cercano al acceso al más lejano (900 ms en total) | Suave   |
| 2,40 s | Puertas giran 0°→90° (400 ms), cascada de 80 ms desde el acceso              | Entrada |
| 2,80 s | Rellenos por zona, 350 ms cada una, 150 ms entre zonas                       | Entrada |
| 3,60 s | Nombres de ambiente (80 ms entre cada uno) y leyenda                         | Entrada |
| 5,60 s | Todo se desvanece junto (400 ms); en `sobreVideo` también el fondo           | Salida  |

Con transparencia el desenfoque de 24 px no se hornea: aplicarlo en el editor sobre el video.
