import { mezcla, tramo } from "../../sistema/movimiento";
import { CURVA } from "../../sistema/tokens";

const ES_DIGITO = /\d/;
const RUEDA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const MAX_DIGITOS_CONTADOR = 6;

export const contarDigitos = (texto: string) => texto.replace(/\D/g, "").length;

// Odómetro: la columna i muestra floor(valor / 10^i) mod 10 y solo rueda
// mientras la columna de la derecha pasa de 9 a 0.
const posicionColumna = (valor: number, columna: number) => {
  const escalado = valor / 10 ** columna;
  const digito = Math.floor(escalado) % 10;
  if (columna === 0) return digito + (escalado % 1);
  const resto = (escalado % 1) * 10;
  return digito + Math.max(0, resto - 9);
};

export const Cifra: React.FC<{
  texto: string;
  t: number;
  inicio: number;
  tamano: number;
  interlineado: number;
  contador: boolean;
}> = ({ texto, t, inicio, tamano, interlineado, contador }) => {
  const alto = tamano * interlineado;
  const caracteres = texto.split("");
  const final = Number(texto.replace(/\D/g, "")) || 0;
  const valor = contador
    ? Math.round(final * tramo(t, inicio, 1.2, CURVA.suave) * 1000) / 1000
    : final;

  // Columna de cada dígito contando desde la derecha (unidades = 0).
  const indices = caracteres.map((c, i) => {
    let col = 0;
    for (let j = i + 1; j < caracteres.length; j++) {
      if (ES_DIGITO.test(caracteres[j])) col++;
    }
    return ES_DIGITO.test(c) ? col : null;
  });

  return (
    <div style={{ display: "flex", height: alto }}>
      {caracteres.map((c, i) => {
        // Cascada de derecha a izquierda: el último carácter arranca primero.
        const desdeDerecha = caracteres.length - 1 - i;
        const p = tramo(t, inicio + desdeDerecha * 0.06, 0.6, CURVA.entrada);
        const sube = mezcla(p, 100, 0);
        const col = indices[i];
        const rueda = contador && col !== null;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              height: alto,
              overflow: "hidden",
              width: ES_DIGITO.test(c) ? "1ch" : undefined,
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                // La máscara es más alta que 100 px: sin esto el dígito asoma antes de arrancar.
                visibility: p > 0 ? "visible" : "hidden",
                transform: `translateY(${sube}px)`,
              }}
            >
              {rueda ? (
                <span
                  style={{
                    display: "block",
                    transform: `translateY(${-posicionColumna(valor, col) * alto}px)`,
                  }}
                >
                  {RUEDA.map((d, k) => (
                    <span key={k} style={{ display: "block", height: alto }}>
                      {d}
                    </span>
                  ))}
                </span>
              ) : (
                c
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
};
