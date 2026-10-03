# 13 · Recorrido del sol / día a noche

Muestra orientación y luminosidad sobre un living o terraza. 5 s.

## Cómo se usa

El tinte de luz necesita modo de fusión sobre el video, que no se puede hornear con transparencia. La pieza sale en dos capas:

1. `13_sol_9x16_v1` (gráfica con alfa): arco, sol, horas y rosa de orientación.
2. `13_soltinte_9x16_v1` (tinte): colocarla sobre el video en **Soft Light al 35 %** (nunca más de 40 %). El gris 50 % es neutro en Soft Light, así que fuera del recorrido no altera la imagen.

## Datos

- `{{ORIENTACION}}` → `ORIENTACION` (por ejemplo "Balcón al norte"), en píldora navy junto a la rosa.
- `norte`: hacia dónde apunta el norte en el cuadro (grados, 0 = arriba).
- El recorrido y la orientación deben ser reales (brújula, plano o datos del cliente). No sugerir sol de mañana si la fachada mira al sur.

```bash
npm run render:13
```

## Diseño

- Arco de 800×400 px, punteado crema 3 px (10/10), con el ápice a 200 px del borde superior de la zona segura.
- Sol dorado de 56 px con halo de 120 px al 30 % y desenfoque de 24 px. Horas 8, 13 y 18 h bajo el horizonte (Inter 28 px) que se encienden en dorado al pasar el sol.
- Tinte: mañana #FFD9A0 → mediodía #FFFFFF → tarde #FF9A5C → noche #2B3F6B.

## Movimiento

| Tiempo | Acción                                                      | Curva   |
| ------ | ----------------------------------------------------------- | ------- |
| 0,00 s | Arco se traza de izquierda a derecha (700 ms)               | Entrada |
| 0,30 s | Rosa y orientación                                          | Entrada |
| 0,50 s | Sol aparece en 8 h                                          | Rebote  |
| 0,80 s | Sol recorre el arco en 3,2 s; el tinte acompaña la hora     | Suave   |
| 4,00 s | Tinte pasa a noche en 600 ms                                | Suave   |
| 4,60 s | Arco y sol se desvanecen (300 ms); el tinte vuelve a neutro | Salida  |
