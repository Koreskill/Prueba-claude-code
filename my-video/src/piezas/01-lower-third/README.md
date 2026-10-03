# 01 · Lower third de propiedad

Presenta tipo, barrio, dirección y precio en los primeros segundos del video. Dura 4 s (prop `duracion`).

## Datos (`{{...}}`)

| Marcador        | Prop        | Ejemplo                 |
| --------------- | ----------- | ----------------------- |
| `{{TIPO}}`      | `TIPO`      | Departamento            |
| `{{BARRIO}}`    | `BARRIO`    | Palermo                 |
| `{{DIRECCION}}` | `DIRECCION` | Av. Santa Fe 1234, 3° B |
| `{{PRECIO}}`    | `PRECIO`    | USD 185.000             |

Opciones: `conPanel` (false = solo sombra de texto, únicamente sobre planos oscuros), `precioSerif` (Playfair Display, solo gama alta), `fondoPreview` (claro/oscuro para revisar en Studio; exportar siempre en `transparente`).

Copiá `datos/01-lower-third.ejemplo.json`, cambiá los valores y exportá:

```bash
scripts/render.sh 01 lowerthird 9x16 v1 datos/mi-propiedad.json
# → out/01_lowerthird_9x16_v1.mov (ProRes 4444), .webm (VP9 alfa), _png/ (secuencia)
```

## Diseño

|       | 9:16                                       | 16:9                    | 4:5                                        |
| ----- | ------------------------------------------ | ----------------------- | ------------------------------------------ |
| Panel | 936×220, x 64, 470 sobre el borde inferior | 760×220, a 96 del borde | 936×220, x 64, 120 sobre el borde inferior |

- Línea 1 `{{TIPO}} · {{BARRIO}}`: Montserrat Bold 56 px; se achica hasta 44 px si no entra y después corta con "…".
- Fila 2: `{{DIRECCION}}` (Inter Medium 32 px, crema 70 %) a la izquierda y chip de precio (Inter Bold 44 px, numerales tabulares) a la derecha. El chip va en la fila de la dirección para que la línea 1 tenga todo el ancho del panel.
- Largo recomendado de la línea 1: hasta ~30 caracteres en 9:16 y ~24 en 16:9.

## Movimiento

| Tiempo | Acción                                                                                                       | Curva   |
| ------ | ------------------------------------------------------------------------------------------------------------ | ------- |
| 0,00 s | Barra dorada crece 0→220 px (450 ms, desde abajo)                                                            | Entrada |
| 0,15 s | Panel se revela de izquierda a derecha (500 ms)                                                              | Entrada |
| 0,35 s | Línea 1 sube 40 px y aparece (450 ms)                                                                        | Entrada |
| 0,44 s | Línea 2 igual, 90 ms después                                                                                 | Entrada |
| 0,70 s | Chip de precio escala 0,9→1                                                                                  | Rebote  |
| 3,70 s | Texto baja 20 px y se desvanece (250 ms); el panel se recoge a la izquierda y termina en el último fotograma | Salida  |

En la edición: colocar la pieza 0,3 s después del corte. Con datos largos, subir `duracion` para respetar el tiempo de lectura (0,8 s + 0,35 s por palabra).

Error común: usar `conPanel: false` sobre pisos o muebles claros; queda ilegible.
