# 11 · Lista de amenities con tildes

Enumera servicios sobre un plano de exteriores. 5 s, hasta 5 ítems.

## Datos

- `amenities`: hasta 5 textos de hasta 22 caracteres (`{{AMENITY}}`). Si no entra, acortar el texto; la fuente no se reduce.
- `TITULO`: "Incluye" u otro; vacío lo oculta.

```bash
npm run render:11
```

## Diseño

- Panel navy 78 % de 520×(96 × ítems + 40) px, a 64 px del borde derecho y 520 px sobre el inferior, radio 24 px.
- Fila de 96 px: círculo dorado de 44 px con tilde navy de 4 px y texto Inter Medium 36 px crema a 20 px; separadores de 1 px crema al 15 %.
- Título Montserrat Bold 40 px dorado, con sombra de texto.

## Movimiento

| Tiempo           | Acción                                                                                                     | Curva   |
| ---------------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| 0,00 s           | Panel desliza 80 px desde la derecha y crece en alto (450 ms)                                              | Entrada |
| 0,50 s           | Fila 1: círculo 0→1 (250 ms), tilde se traza (200 ms), texto con fundido y 24 px de deslizamiento (350 ms) | Rebote  |
| +0,45 s por fila | Siguientes filas, mismo ritmo                                                                              | Rebote  |
| Fin − 0,5 s      | Filas se desvanecen de arriba hacia abajo (50 ms) y el panel se retira                                     | Salida  |
