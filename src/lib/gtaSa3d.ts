/** GTA San Andreas PS2-era palette for procedural 3D scenes */
export const SA3D = {
  night: "#0c0913",
  nightDeep: "#06040a",
  asphalt: "#2a1c14",
  road: "#3a281c",
  gridLine: "#c46830",
  gridFade: "#7a4828",
  sand: "#e8d5a0",
  grove: "#36682c",
  money: "#54b948",
  moneyBright: "#7fd96f",
  sunset: "#f2772f",
  sunsetDeep: "#c04a18",
  hud: "#8aa8c3",
  hudDark: "#4a6078",
  blood: "#7a2228",
  bloodDark: "#4a1218",
  violet: "#4a2860",
  violetDeep: "#2a1430",
  silhouette: "#0f0818",
  silhouetteAlt: "#181028",
  window: "#f2c040",
  windowDim: "#8a6030",
  palm: "#0a060f",
  trunk: "#4a3020",
  fogHero: "#3d2048",
  fogStats: "#161021",
  concrete: "#3a3a42",
  concreteDark: "#222228",
  gymWall: "#1a2838",
  gymFloor: "#2a2420",
} as const;

export function saBasic(color: string, opts?: { transparent?: boolean; opacity?: number }) {
  return {
    color,
    transparent: opts?.transparent ?? false,
    opacity: opts?.opacity ?? 1,
  };
}
