import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EtiquetaAmbiente } from "../../sistema/EtiquetaAmbiente";
import { FondoPreview } from "../../sistema/FondoPreview";
import { FUENTE } from "../../sistema/fuentes";
import { mezcla, tramo, trazo, ventanaSalida } from "../../sistema/movimiento";
import { COLOR, CURVA, ZONA_SEGURA } from "../../sistema/tokens";
import { PropsPlano } from "./esquema";
import { PLANO_EJEMPLO, Punto, Zona } from "./plano";

const ANCHO_PLANO = 880;
const GAP_LEYENDA = 40;
const ALTO_LEYENDA = 38;

// Misma familia dorada, distinto matiz por zona; rellenos al 12 %.
const COLOR_ZONA: Record<Zona, string> = {
  social: COLOR.dorado,
  dormitorios: "#E6CD8F",
  servicio: "#A8823A",
};
const ORDEN_ZONAS: Zona[] = ["social", "dormitorios", "servicio"];

const ESTILOS = {
  sobreVideo: { exterior: 6, interior: 4, puerta: 3, muro: COLOR.crema },
  portada: { exterior: 3, interior: 2, puerta: 2, muro: "#FFFFFF" },
} as const;

const largo = ([a, b]: [Punto, Punto]) => Math.hypot(b[0] - a[0], b[1] - a[1]);

const distanciaASegmento = (p: Punto, [a, b]: [Punto, Punto]) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const k = Math.max(
    0,
    Math.min(
      1,
      ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy),
    ),
  );
  return Math.hypot(p[0] - a[0] - k * dx, p[1] - a[1] - k * dy);
};

const centroide = (puntos: Punto[]): Punto => {
  let area = 0;
  let cx = 0;
  let cy = 0;
  puntos.forEach(([x0, y0], i) => {
    const [x1, y1] = puntos[(i + 1) % puntos.length];
    const f = x0 * y1 - x1 * y0;
    area += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  });
  return [cx / (3 * area), cy / (3 * area)];
};

export const PlanoDibujado: React.FC<PropsPlano> = ({
  SUP_TOTAL,
  formato,
  estilo,
  mostrarNombres,
  fondoPreview,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;
  const plano = PLANO_EJEMPLO;
  const e = ESTILOS[estilo];

  // Escala: 880 px de ancho, o menos si el alto no entra en la zona segura.
  const zona = ZONA_SEGURA[formato];
  const altoDisponible =
    height - zona.top - zona.bottom - GAP_LEYENDA - ALTO_LEYENDA;
  const s = Math.min(ANCHO_PLANO / plano.ancho, altoDisponible / plano.alto);
  const anchoPx = plano.ancho * s;
  const altoPx = plano.alto * s;
  const altoBloque = altoPx + GAP_LEYENDA + ALTO_LEYENDA;
  const x0 = (width - anchoPx) / 2;
  const y0 = zona.top + (height - zona.top - zona.bottom - altoBloque) / 2;
  const px = ([x, y]: Punto): Punto => [x0 + x * s, y0 + y * s];

  const salida = ventanaSalida(durationInFrames, fps, 0.4);
  const q = tramo(t, salida.inicio, salida.duracion, CURVA.salida);

  // Fondo
  const pFondo = estilo === "portada" ? 1 : tramo(t, 0, 0.4, CURVA.suave);
  const opacidadFondo = estilo === "portada" ? 1 : pFondo * (1 - q);

  // Muros exteriores: un solo trazo siguiendo el perímetro desde el acceso.
  const pExterior = tramo(t, 0.3, 1.6, CURVA.suave);
  const dExterior = plano.exterior
    .map((p, i) => `${i === 0 ? "M" : "L"} ${px(p).join(" ")}`)
    .join(" ");

  // Tabiques: de a uno, del más cercano al acceso al más lejano, con tiempo proporcional al largo.
  const tabiques = [...plano.tabiques].sort(
    (a, b) =>
      distanciaASegmento(plano.acceso, a) - distanciaASegmento(plano.acceso, b),
  );
  const largoTotal = tabiques.reduce((acc, seg) => acc + largo(seg), 0);
  const avance = tramo(t, 1.6, 0.9, CURVA.suave) * largoTotal;
  let acumulado = 0;
  const pTabiques = tabiques.map((seg) => {
    const l = largo(seg);
    const p = Math.max(0, Math.min(1, (avance - acumulado) / l));
    acumulado += l;
    return p;
  });

  const puertas = [...plano.puertas].sort(
    (a, b) =>
      Math.hypot(
        a.bisagra[0] - plano.acceso[0],
        a.bisagra[1] - plano.acceso[1],
      ) -
      Math.hypot(
        b.bisagra[0] - plano.acceso[0],
        b.bisagra[1] - plano.acceso[1],
      ),
  );

  const pZona = (zona: Zona) =>
    tramo(t, 2.8 + ORDEN_ZONAS.indexOf(zona) * 0.15, 0.35, CURVA.entrada);

  const pLeyenda = tramo(t, 3.6, 0.45, CURVA.entrada);

  return (
    <AbsoluteFill>
      <FondoPreview tipo={fondoPreview} />
      <AbsoluteFill
        style={
          estilo === "portada"
            ? { background: COLOR.navy }
            : {
                background: "rgba(15, 27, 45, 0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                opacity: opacidadFondo,
              }
        }
      />

      <AbsoluteFill style={{ opacity: 1 - q }}>
        <svg width={width} height={height} style={{ position: "absolute" }}>
          {plano.ambientes.map((a) => (
            <polygon
              key={a.nombre}
              points={a.contorno.map((p) => px(p).join(",")).join(" ")}
              fill={COLOR_ZONA[a.zona]}
              opacity={0.12 * pZona(a.zona)}
            />
          ))}

          <path
            d={dExterior}
            fill="none"
            stroke={e.muro}
            strokeWidth={e.exterior}
            strokeLinejoin="miter"
            strokeLinecap="square"
            {...trazo(pExterior)}
          />

          {tabiques.map((seg, i) => {
            const [a, b] = seg.map(px);
            return (
              <line
                key={i}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                stroke={e.muro}
                strokeWidth={e.interior}
                strokeLinecap="square"
                {...trazo(pTabiques[i])}
              />
            );
          })}

          {puertas.map((puerta, i) => {
            const p = tramo(t, 2.4 + i * 0.08, 0.4, CURVA.entrada);
            if (p <= 0) return null;
            const [hx, hy] = px(puerta.bisagra);
            const r = puerta.hoja * s;
            const ang = mezcla(p, puerta.desde, puerta.hasta);
            const punta = (g: number): Punto => [
              hx + r * Math.cos((g * Math.PI) / 180),
              hy + r * Math.sin((g * Math.PI) / 180),
            ];
            const [ax, ay] = punta(puerta.desde);
            const [bx, by] = punta(ang);
            const horario = puerta.hasta > puerta.desde ? 1 : 0;
            return (
              <g
                key={i}
                stroke={COLOR.dorado}
                strokeWidth={e.puerta}
                fill="none"
                strokeLinecap="round"
              >
                <line x1={hx} y1={hy} x2={bx} y2={by} />
                <path
                  d={`M ${ax} ${ay} A ${r} ${r} 0 0 ${horario} ${bx} ${by}`}
                />
              </g>
            );
          })}
        </svg>

        {mostrarNombres
          ? plano.ambientes.map((a, i) => {
              const inicio = 3.6 + i * 0.08;
              const pExpandir = tramo(t, inicio, 0.4, CURVA.entrada);
              const pTexto = tramo(t, inicio + 0.2, 0.25, CURVA.entrada);
              const [cx, cy] = px(a.etiqueta ?? centroide(a.contorno));
              return (
                <div
                  key={a.nombre}
                  style={{
                    position: "absolute",
                    left: cx,
                    top: cy,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <EtiquetaAmbiente
                    texto={a.nombre}
                    escala={0.78}
                    expandir={pExpandir}
                    textoVisible={pTexto}
                  />
                </div>
              );
            })
          : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: y0 + altoPx + GAP_LEYENDA,
            textAlign: "center",
            fontFamily: FUENTE.dato,
            fontWeight: 500,
            fontSize: 32,
            lineHeight: `${ALTO_LEYENDA}px`,
            color: COLOR.crema,
            fontVariantNumeric: "lining-nums tabular-nums",
            opacity: pLeyenda,
            transform: `translateY(${mezcla(pLeyenda, 20, 0)}px)`,
          }}
        >
          {SUP_TOTAL} m² totales
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
