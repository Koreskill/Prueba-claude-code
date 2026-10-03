# 08 · Mapa de ubicación con anillos de cercanía

Vende la zona. Pantalla completa, 6 s, 9:16.

## Datos

- `{{BARRIO}}` → `BARRIO`.
- `puntos` (hasta 4): `tipo` (`subte`, `escuela`, `parque`, `comercio`), `NOMBRE`, `MIN` y `angulo` (grados; 0 = derecha, 90 = abajo, como en el mapa real).
- La distancia al pin sale de los minutos a pie: 5 min = 180 px (primer anillo), 10 min = 340 px (segundo). Así el punto siempre cae coherente con los anillos. Verificar los tiempos en un mapa real (80 m/min).

```bash
npm run render:08   # out/08_mapa_9x16_v1.mov / .webm / _png
```

## Diseño

- Mapa estilizado generado por código (sin datos ni etiquetas de terceros): calles #0F1B2D, manzanas #16263E, agua y plaza #1E3556.
- Pin: gota dorada de 72×96 px con casa crema. Anillos dorados de 3 px punteados 12/10 con relleno al 8 %.
- Puntos: círculo crema de 44 px con ícono navy de 26 px; etiqueta "{{NOMBRE}} · {{MIN}} min" en Inter 28 px con sombra.
- Panel inferior navy con barra dorada y `{{BARRIO}}` en Montserrat Bold 56 px, sobre la zona de interfaz.

## Movimiento

| Tiempo          | Acción                                                            | Curva   |
| --------------- | ----------------------------------------------------------------- | ------- |
| 0,00 s          | Mapa entra y hace zoom continuo 110 %→100 % durante toda la pieza | Suave   |
| 0,30 s          | Pin cae desde 120 px arriba (600 ms)                              | Rebote  |
| 0,50 s          | Panel del barrio sube 40 px                                       | Entrada |
| 0,90 s / 1,40 s | Anillos de 5 y 10 min se expanden desde r = 0 (700 ms)            | Entrada |
| 2,00 s          | Puntos de interés, 300 ms cada uno, 200 ms de escalonado          | Rebote  |
| 5,60 s          | Todo se desvanece (400 ms)                                        | Salida  |
