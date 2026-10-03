# 10 · Barra de progreso del recorrido

Acompaña un tour de 30 a 90 s. La pieza dura la suma de los tramos.

## Datos

`ambientes`: lista de `{ "AMBIENTE": "Living", "segundos": 6 }` con la duración real de cada tramo en el video. Con más de 6 ambientes se muestran solo puntos numerados, sin nombres.

```bash
npm run render:10
```

## Diseño

- Riel de 952×6 px crema al 25 % a 400 px del borde inferior; relleno dorado con punta redondeada.
- Un punto por ambiente en el inicio de su tramo (proporcional a la duración, no equidistante). Actual: 28 px dorado con aro crema de 3 px; pasados: dorado; futuros: crema al 40 %.
- Nombre del ambiente actual sobre el riel, alineado al punto: Inter SemiBold 28 px con sombra.

## Movimiento

| Tiempo      | Acción                                                                                                       | Curva   |
| ----------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| 0,00 s      | Riel se traza de izquierda a derecha (500 ms)                                                                | Entrada |
| 0,30 s      | Puntos en cascada, 40 ms de escalonado                                                                       | Rebote  |
| Continuo    | El relleno avanza lineal y llega al 100 % al empezar la salida                                               | Lineal  |
| Cada cambio | Punto actual pulsa 1→1,3→1 (300 ms); el nombre sale 16 px hacia arriba y el nuevo entra desde abajo (350 ms) | Entrada |
| Fin − 0,3 s | Riel completo se desvanece                                                                                   | Salida  |
