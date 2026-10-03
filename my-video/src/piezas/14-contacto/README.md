# 14 · Tarjeta de contacto y CTA final con QR

Cierre del video, últimos 4 a 5 s sobre el último plano.

## Datos

- `LOGO`: archivo en `public/` (PNG o SVG con transparencia); se tiñe de crema. Vacío: muestra `MARCA` como texto.
- `{{CTA}}`, `{{TELEFONO}}` (vacío = versión sin teléfono), `{{WEB}}`, `{{MATRICULA}}`.
- `QR`: contenido del código (por ejemplo `https://wa.me/549…`). **Probarlo con dos teléfonos antes de exportar.** Incluir la matrícula si la normativa local lo exige.

```bash
npm run render:14
```

## Diseño

- Fondo navy al 70 % (+ desenfoque de 20 px a aplicar en el editor sobre el último cuadro).
- Logo de 360 px centrado al 22 % de la altura. CTA en Montserrat Bold 72 px, máximo dos líneas.
- Botón dorado de 760×120 px con ícono de chat de 52 px y teléfono en Inter Bold 44 px navy.
- QR de 280 px (margen de silencio de 4 módulos incluido) en tarjeta crema con padding de 20 px. En 9:16 no entra al costado del botón (760 + 320 > 1080), así que va centrado debajo.
- Pie "{{WEB}} · {{MATRICULA}}" en Inter 28 px al 70 %, dentro de la zona segura.

## Movimiento

| Tiempo      | Acción                                                                                | Curva   |
| ----------- | ------------------------------------------------------------------------------------- | ------- |
| 0,00 s      | Fondo se oscurece (500 ms)                                                            | Suave   |
| 0,30 s      | Logo 0,9→1 con fundido (500 ms)                                                       | Entrada |
| 0,60 s      | CTA palabra por palabra, sube 40 px, 70 ms de escalonado                              | Entrada |
| 1,10 s      | Botón se expande de 120 a 760 px (500 ms); el texto aparece al 70 %                   | Rebote  |
| 1,40 s      | QR 0,85→1 (400 ms)                                                                    | Entrada |
| 1,80 s      | El botón late 1→1,03→1 cada 1,4 s; se detiene 2 s antes del final para poder escanear | Suave   |
| Fin − 0,5 s | Todo se funde a navy                                                                  | Salida  |
