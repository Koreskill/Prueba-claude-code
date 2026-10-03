# 12 · Antes y después con cortina

Reformas o home staging. 6 s. Necesita dos tomas con el mismo encuadre.

## Cómo se usa

Con fondo transparente, la cortina no puede revelar el video por sí sola. Por eso la pieza sale en dos capas:

1. `12_antesdespues_9x16_v1` (gráfica con alfa): divisor, mango, etiquetas y dato.
2. `12_antesdespuesmascara_9x16_v1` (máscara): blanco = DESPUÉS, negro = ANTES.

En el editor: toma ANTES abajo, toma DESPUÉS arriba con la máscara como **máscara de luma** (track matte), y la gráfica encima de todo.

Si se pasan las tomas en `ANTES` y `DESPUES` (archivos en `public/` o URLs, imagen o video), la pieza las compone directamente.

```bash
npm run render:12
```

## Diseño

- Divisor crema de 4 px con sombra 0 0 16 px y mango de 72 px con flechas navy.
- Etiquetas de 56 px, Montserrat Bold 28 px con +8 % de espaciado, por debajo de 250 px. Como la cortina revela DESPUÉS desde la izquierda, DESPUÉS va arriba a la izquierda y ANTES arriba a la derecha: cada etiqueta queda sobre su toma.
- Dato opcional `{{INVERSION}}` / `{{PLAZO}}` en panel navy (prop `DATO`, vacío lo oculta).

## Movimiento

| Tiempo | Acción                                                                 | Curva   |
| ------ | ---------------------------------------------------------------------- | ------- |
| 0,00 s | Solo ANTES; su etiqueta entra (300 ms)                                 | Entrada |
| 1,50 s | Mango aparece en el borde izquierdo                                    | Rebote  |
| 1,80 s | Cortina de izquierda a derecha en 1,6 s con pausa de 200 ms en el 50 % | Suave   |
| 3,40 s | Entra DESPUÉS; ANTES baja al 40 %                                      | Entrada |
| 3,60 s | Dato                                                                   | Entrada |
| 4,00 s | Mango vuelve al centro (800 ms) y respira ±10 px                       | Suave   |
| 5,60 s | La gráfica se desvanece (400 ms)                                       | Salida  |

Las dos tomas deben coincidir en ejes y altura de cámara; si no, estabilizar y corregir exposición para que el divisor no delate la diferencia de luz.
