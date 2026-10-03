# 03 · Chips de ficha técnica

Resumen de dormitorios, baños, m² y cocheras sobre el living o el exterior. Dura 4 s.

## Datos

`{{DORMITORIOS}}`, `{{BANOS}}`, `{{M2}}`, `{{COCHERAS}}` → props del mismo nombre. Un valor vacío oculta su chip. La unidad pasa a singular sola ("1 cochera"). Máximo 4 datos: si hay más, dividir en dos apariciones de 3 s.

```bash
scripts/render.sh 03 ficha 9x16 v1 datos/03-ficha.ejemplo.json
```

## Diseño

- **9:16 y 4:5:** grilla 2×2 de chips de 440×150 px, separación 24 px, bloque centrado al 62 % de la altura. Ícono de 56 px a la izquierda; número Montserrat Bold 64 px + unidad Inter 28 px al 70 % en la misma línea de base.
- **16:9:** fila de 4 chips de 230×120 px en la franja inferior (96 px de margen). Para que "dormitorios" entre a 28 px, la unidad va debajo del número (ícono de 44 px + número de 52 px arriba).
- Panel navy 78 % con desenfoque, radio 28 px, trazo dorado de 3 px en el borde superior.
- Íconos de `src/sistema/Iconos.tsx`: cama, bañera, superficie y auto, trazo 4 px y terminaciones redondeadas.

## Movimiento

| Tiempo                      | Acción                                                                                                 | Curva   |
| --------------------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| 0,00 / 0,08 / 0,16 / 0,24 s | Cada chip: escala 0,92→1, opacidad 0→1, sube 40 px (450 ms)                                            | Entrada |
| 0,40 s (+80 ms por chip)    | El ícono se traza (500 ms, un trazo tras otro) y el número cuenta de 0 al valor (600 ms)               | Suave   |
| 3,60 s                      | Salida en el mismo orden, 250 ms cada uno, 50 ms entre chips; el último termina en el último fotograma | Salida  |
