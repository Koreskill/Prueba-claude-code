# 05 · Cotas y medición de metros cuadrados

Sobre un ambiente amplio (living, terraza, jardín) para mostrar dimensiones. Dura 3,5 s.

## Datos

- `{{ANCHO}}`, `{{LARGO}}`, `{{M2}}`: datos del cliente, nunca estimados por el editor.
- Geometría en px del cuadro: `cotaAncho` y `cotaLargo` (`a`, `b` sobre el borde medido y `lado` 1/-1 para elegir hacia dónde se separa la cota) y `piso` (contorno para la trama). Cada formato trae una geometría de ejemplo; para un plano real, marcar los puntos sobre un fotograma y pasarlos en el JSON.

```bash
scripts/render.sh 05 cotas 9x16 v1 datos/05-cotas.ejemplo.json
```

## Diseño

- Línea de cota crema 4 px a 30 px del objeto, flechas de 14 px, extensiones perpendiculares de 3 px.
- Píldora navy de 64 px de alto centrada en la cota: "{{ANCHO}} m" en Inter Bold 36 px.
- Trama diagonal dorada de 2 px cada 18 px al 25 % sobre el piso; píldora dorada "{{M2}} m²" en Inter Bold 44 px navy en el centro del piso.
- Las líneas llevan una sombra suave para separarse de pisos claros.
- Si el plano es en perspectiva, usar cotas horizontales sobre el eje de la cámara. Si la cámara se mueve más del 15 % del cuadro, anclar la cota con tracking de 2 puntos en el editor.

## Movimiento

| Tiempo | Acción                                                                               | Curva            |
| ------ | ------------------------------------------------------------------------------------ | ---------------- |
| 0,00 s | Extensiones (150 ms)                                                                 | Entrada          |
| 0,15 s | La cota se traza de A a B (600 ms); la flecha viaja con el trazo y se fija al llegar | Entrada          |
| 0,60 s | Píldora de medida escala 0,85→1                                                      | Rebote           |
| 1,10 s | Segunda cota, mismo proceso                                                          | Entrada          |
| 1,80 s | Trama barre de izquierda a derecha (500 ms); píldora de m² a los 2,00 s              | Entrada / Rebote |
| 3,15 s | Salida en orden inverso (m², cota 2, cota 1), 250 ms cada una                        | Salida           |
