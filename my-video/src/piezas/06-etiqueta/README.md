# 06 · Etiquetas de ambiente con línea guía

Nombra cada ambiente durante el recorrido. Dura 2,5 s por ambiente.

## Datos

- `{{AMBIENTE}}` y `{{M2}}` (opcional; vacío oculta la subetiqueta).
- `ancla` (px) sobre el objeto y `direccion` de la guía a 45°: `arribaDerecha`, `arribaIzquierda`, `abajoDerecha`, `abajoIzquierda`. Elegir la que lleve la etiqueta al tercio libre del cuadro, nunca sobre la cara del objeto principal.
- `conLinea: false`: solo la píldora flotando (en `ancla`), para planos con cámara en movimiento.

```bash
scripts/render.sh 06 etiqueta 9x16 v1 datos/06-etiqueta.ejemplo.json
scripts/render.sh 06 etiquetasinlinea 9x16 v1 datos/06-etiqueta.sinlinea.json etiqueta
```

## Diseño

- Píldora navy 78 % de 72 px, padding 32 px, radio 36 px; punto dorado de 14 px y texto Montserrat SemiBold 36 px crema. Componente compartido: `src/sistema/EtiquetaAmbiente.tsx`.
- Guía dorada de 3 px y 120 px a 45°. Ancla: círculo dorado de 18 px con aro crema de 3 px.
- Subetiqueta "{{M2}} m²" en Inter 28 px crema al 70 % con sombra de texto.

## Movimiento

| Tiempo | Acción                                                                                                           | Curva   |
| ------ | ---------------------------------------------------------------------------------------------------------------- | ------- |
| 0,00 s | Ancla escala 0→1 (250 ms)                                                                                        | Rebote  |
| 0,15 s | Guía se traza hacia la etiqueta (300 ms)                                                                         | Entrada |
| 0,40 s | Píldora se expande desde el final de la guía (400 ms)                                                            | Entrada |
| 0,60 s | Texto con fundido (250 ms)                                                                                       | Entrada |
| 2,20 s | Texto se va, la píldora se contrae, la guía vuelve al ancla y el ancla se cierra; termina en el último fotograma | Salida  |

Una sola etiqueta por plano; si el plano dura más de 5 s, reemplazarla a mitad.
