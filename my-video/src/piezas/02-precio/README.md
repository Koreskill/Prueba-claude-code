# 02 · Revelado de precio con contador

Momento de mayor impacto del video, sobre la fachada o la vista final. Dura 3,5 s (4,5 s en la variante rebaja).

## Datos (`{{...}}`)

| Marcador              | Prop              | Ejemplo                                    |
| --------------------- | ----------------- | ------------------------------------------ |
| `{{MONEDA}}`          | `MONEDA`          | USD / $                                    |
| `{{PRECIO}}`          | `PRECIO`          | 185.000 (tal como se lee, con separadores) |
| `{{LEYENDA}}`         | `LEYENDA`         | Financiación disponible                    |
| `{{PRECIO_ANTERIOR}}` | `PRECIO_ANTERIOR` | 210.000 (solo rebaja)                      |

`variante`: `tambor` (base), `contador` o `rebaja`. Ejemplos listos en `datos/02-precio.*.json`.

```bash
scripts/render.sh 02 precio 9x16 v1 datos/02-precio.tambor.json
scripts/render.sh 02 preciorebaja 9x16 v1 datos/02-precio.rebaja.json precio
```

## Diseño

- Cifra centrada, con el centro de la línea al 38 % de la altura. Montserrat Bold 140 px, crema, numerales tabulares; cada dígito ocupa una celda de ancho fijo para que nada salte.
- Moneda Montserrat Bold 56 px dorado, con la línea de mayúsculas alineada a la de la cifra.
- Debajo: leyenda Inter Medium 30 px y, bajo ella, línea dorada de 360×6 px.
- Fondo: navy 0 % abajo que sube a 55 % a la altura del precio y se sostiene hasta arriba.
- Cifra, moneda y leyenda llevan además la sombra de texto del sistema.

## Movimiento (variante tambor)

| Tiempo | Acción                                                                                                      | Curva   |
| ------ | ----------------------------------------------------------------------------------------------------------- | ------- |
| 0,00 s | Degradado entra (300 ms)                                                                                    | Suave   |
| 0,20 s | Cada carácter sube 100 px desde su máscara, de derecha a izquierda, 60 ms entre caracteres, 600 ms cada uno | Entrada |
| 0,80 s | Moneda escala 0,8→1                                                                                         | Rebote  |
| 1,00 s | Línea dorada se traza del centro hacia afuera (400 ms)                                                      | Entrada |
| 1,20 s | Leyenda aparece con fundido (350 ms)                                                                        | Entrada |
| 3,20 s | Todo se desvanece subiendo 40 px y el degradado se va; termina en el último fotograma                       | Salida  |

**Contador:** además de subir, cada columna gira como un odómetro de 0 al valor final en 1,2 s (curva suave). Solo con hasta 6 dígitos; con más, la pieza vuelve sola a la variante tambor.

**Rebaja:** el precio anterior entra arriba (Montserrat SemiBold 64 px, 50 % de opacidad), a los 0,70 s una línea roja #D64545 lo tacha en 250 ms y el precio nuevo arranca 200 ms después; el resto de la secuencia se corre 0,95 s. El precio anterior queda tachado en pantalla hasta la salida.
