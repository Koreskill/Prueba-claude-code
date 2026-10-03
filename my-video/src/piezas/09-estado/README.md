# 09 · Cinta y sello de estado

Indica Nuevo, Reservado, Vendido, Rebajado u Oportunidad. 3 a 5 s, o fija durante todo el video (`duracion` hasta 60 s).

## Datos

- `ESTADO`: `Nuevo`, `Reservado`, `Vendido`, `Rebajado`, `Oportunidad`. **"Vendido" solo con confirmación del cliente.**
- `cinta` / `sello`: mostrar cada elemento.
- `temblor: false` para gama alta: sin temblor y el sello entra con fundido de 250 ms.

```bash
npm run render:09
```

## Diseño

- Colores: Nuevo dorado / navy · Reservado ámbar / navy · Vendido rojo / crema · Rebajado verde / navy · Oportunidad (sin color en la especificación) navy / dorado.
- Cinta de 520×84 px rotada −45°, Montserrat Bold 40 px con +6 % de espaciado. La esquina que la recorta está en (0, 250), debajo de la zona de interfaz, en lugar de la esquina real del cuadro.
- Sello de 280 px con doble aro (6 px + 2 px, separación 8 px), estrella de 5 puntas y texto central de hasta 52 px (se achica para que la palabra entre en el aro), girado −12°.

## Movimiento

| Tiempo      | Acción                                                                                        | Curva   |
| ----------- | --------------------------------------------------------------------------------------------- | ------- |
| 0,00 s      | Cinta desliza desde fuera del cuadro (450 ms)                                                 | Entrada |
| 0,00 s      | Sello cae: escala 1,6→1 y giro −30°→−12° (300 ms); impacto con temblor de 6 px durante 150 ms | Rebote  |
| 0,40 s      | Aro exterior del sello pulsa 1→1,06→1                                                         | Suave   |
| 0,45 s      | Brillo blanco al 35 % cruza la cinta una vez (600 ms)                                         | Suave   |
| Fin − 0,3 s | Cinta desliza de vuelta y el sello se desvanece                                               | Salida  |

El temblor sacude la capa gráfica. Para que tiemble el video, aplicar el mismo temblor en el editor (fotogramas 9 a 13).
