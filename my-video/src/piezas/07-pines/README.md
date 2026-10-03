# 07 · Hotspots / pines con pulso

Señala detalles puntuales del plano. Dura 3 s, hasta 3 pines.

## Datos

`pines`: lista de 1 a 3 con `x`, `y` (px), `DETALLE` y `SECUNDARIO` (`{{DETALLE}}`, `{{SECUNDARIO}}`). Cada formato trae tres pines de ejemplo; para un plano real, pasarlos en el JSON:

```json
{
  "pines": [
    {
      "x": 300,
      "y": 820,
      "DETALLE": "Pisos de madera",
      "SECUNDARIO": "Roble natural"
    }
  ]
}
```

Seguimiento: si la cámara se mueve, exportar el tracking del editor (3 puntos) como `seguimiento: [{ "t": 0, "x": 300, "y": 820 }, …]` en cada pin. El pin lo sigue y el callout lo sigue con 120 ms de retraso.

```bash
scripts/render.sh 07 pines 9x16 v1 datos/07-pines.ejemplo.json
```

## Diseño

- Pin dorado de 28 px con centro crema de 10 px; con más de un pin, el centro se reemplaza por el número (Montserrat Bold 16 px navy).
- Pulso: dos anillos dorados de 3 px que crecen de 28 a 96 px mientras la opacidad baja de 70 % a 0.
- Callout navy 78 % de 380×96 px, radio 20 px, a 60 px del pin hacia el lado con más espacio y dentro de la zona segura. Título Inter Bold 32 px; segunda línea Inter 28 px al 70 %.

## Movimiento

| Tiempo                  | Acción                                                                                                                             | Curva                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 0,00 s (+0,3 s por pin) | Pin 0→1,15→1 (350 ms)                                                                                                              | Rebote                                |
| 0,20 s                  | Pulso: ciclo de 1,2 s, segundo anillo con 400 ms de desfase, 2 ciclos (nunca eterno)                                               | Entrada en tamaño, salida en opacidad |
| 0,45 s                  | Callout se despliega desde el pin: escala 0,6→1 y fundido (400 ms)                                                                 | Entrada                               |
| 2,52 s                  | Callout sale (250 ms), el pulso se detiene, el pin se achica (200 ms); 50 ms entre pines; el último termina en el último fotograma | Salida                                |
