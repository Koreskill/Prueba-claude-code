// Plano vectorial en metros (vista cenital, origen arriba a la izquierda).
// Si el plano llega en PDF, se redibujan los muros acá como trazos: nunca se importa la imagen.

export type Punto = [number, number];
export type Zona = "social" | "dormitorios" | "servicio";

export type Plano = {
  ancho: number;
  alto: number;
  // Punto de acceso: ordena el trazado de tabiques y puertas.
  acceso: Punto;
  // Perímetro exterior en orden de recorrido, empezando en el acceso.
  // El hueco de la puerta de entrada queda entre el último y el primer punto.
  exterior: Punto[];
  // Tabiques interiores, ya cortados en los vanos de puerta.
  tabiques: [Punto, Punto][];
  // Puerta: bisagra, ancho de hoja y ángulos (grados, 0 = +x, 90 = +y) cerrada → abierta.
  puertas: { bisagra: Punto; hoja: number; desde: number; hasta: number }[];
  // `etiqueta` opcional: dónde va el nombre si el centroide no conviene.
  ambientes: {
    nombre: string;
    zona: Zona;
    contorno: Punto[];
    etiqueta?: Punto;
  }[];
};

// Ejemplo: departamento de 2 dormitorios, 11 × 8 m.
export const PLANO_EJEMPLO: Plano = {
  ancho: 11,
  alto: 8,
  acceso: [1.45, 8],
  exterior: [
    [1.9, 8],
    [11, 8],
    [11, 0],
    [0, 0],
    [0, 8],
    [1.0, 8],
  ],
  tabiques: [
    [
      [0, 3.2],
      [1.2, 3.2],
    ],
    [
      [2.0, 3.2],
      [3.6, 3.2],
    ],
    [
      [3.6, 0],
      [3.6, 3.2],
    ],
    [
      [3.6, 3.2],
      [4.2, 3.2],
    ],
    [
      [5.0, 3.2],
      [5.6, 3.2],
    ],
    [
      [5.6, 0],
      [5.6, 3.8],
    ],
    [
      [5.6, 3.8],
      [6.0, 3.8],
    ],
    [
      [6.8, 3.8],
      [11, 3.8],
    ],
    [
      [7.4, 3.8],
      [7.4, 4.3],
    ],
    [
      [7.4, 5.1],
      [7.4, 8],
    ],
  ],
  puertas: [
    { bisagra: [1.0, 8], hoja: 0.9, desde: 0, hasta: -90 },
    { bisagra: [1.2, 3.2], hoja: 0.8, desde: 0, hasta: -90 },
    { bisagra: [4.2, 3.2], hoja: 0.8, desde: 0, hasta: -90 },
    { bisagra: [6.0, 3.8], hoja: 0.8, desde: 0, hasta: -90 },
    { bisagra: [7.4, 4.3], hoja: 0.8, desde: 90, hasta: 0 },
  ],
  ambientes: [
    {
      nombre: "Living comedor",
      zona: "social",
      contorno: [
        [0, 3.2],
        [5.6, 3.2],
        [5.6, 3.8],
        [7.4, 3.8],
        [7.4, 8],
        [0, 8],
      ],
    },
    {
      nombre: "Cocina",
      zona: "servicio",
      contorno: [
        [0, 0],
        [3.6, 0],
        [3.6, 3.2],
        [0, 3.2],
      ],
    },
    {
      nombre: "Baño",
      zona: "servicio",
      contorno: [
        [3.6, 0],
        [5.6, 0],
        [5.6, 3.2],
        [3.6, 3.2],
      ],
    },
    {
      nombre: "Suite",
      zona: "dormitorios",
      contorno: [
        [5.6, 0],
        [11, 0],
        [11, 3.8],
        [5.6, 3.8],
      ],
    },
    {
      nombre: "Dormitorio",
      zona: "dormitorios",
      contorno: [
        [7.4, 3.8],
        [11, 3.8],
        [11, 8],
        [7.4, 8],
      ],
    },
  ],
};
