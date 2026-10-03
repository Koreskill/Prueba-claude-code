# 15 · Transición de marca entre ambientes

Une dos planos con una pieza de marca de 0,8 s (24 fotogramas).

## Cómo se usa

Colocar la pieza sobre el corte: el plano A termina y el B empieza en el **fotograma 11** de la transición, cuando el cuadrado dorado cubre todo el cuadro. Máximo 3 transiciones de marca por video de 60 s; el resto, cortes simples.

## Datos

`LOGO` (archivo en `public/`, se tiñe de navy) o `MARCA` como texto.

```bash
npm run render:15
```

## Movimiento

| Tiempo      | Acción                                                                     | Curva   |
| ----------- | -------------------------------------------------------------------------- | ------- |
| 0,00–0,33 s | Cuadrado dorado (radio 24 px) crece desde el centro hasta cubrir el cuadro | Suave   |
| 0,33 s      | Corte de A a B, invisible                                                  | Corte   |
| 0,33–0,55 s | Logo navy de 240 px retenido, 0,95→1                                       | Suave   |
| 0,55–0,80 s | El cuadrado se abre con una máscara circular desde el centro               | Entrada |
