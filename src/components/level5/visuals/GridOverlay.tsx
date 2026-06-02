/**
 * a/b × c/d visualized as an area grid. Rows = a.d, cols = b.d.
 * The intersected a.n × b.n cells in the top-left are shaded as
 * the "part of a part" overlap.
 */
export function GridOverlay({
  rows,
  cols,
  rowsFilled,
  colsFilled,
  cell = 28,
  shadeOverlap = true,
}: {
  rows: number;
  cols: number;
  rowsFilled: number;
  colsFilled: number;
  cell?: number;
  shadeOverlap?: boolean;
}) {
  const W = cols * cell;
  const H = rows * cell;
  return (
    <svg width={W} height={H} role="img" aria-label={`${rowsFilled} of ${rows} rows by ${colsFilled} of ${cols} columns`}>
      {/* row tint */}
      <rect
        x={0}
        y={0}
        width={W}
        height={rowsFilled * cell}
        fill="#5fd0ff"
        opacity={0.18}
      />
      {/* col tint */}
      <rect
        x={0}
        y={0}
        width={colsFilled * cell}
        height={H}
        fill="#b18bff"
        opacity={0.18}
      />
      {/* overlap */}
      {shadeOverlap && (
        <rect
          x={0}
          y={0}
          width={colsFilled * cell}
          height={rowsFilled * cell}
          fill="#7df4c6"
          opacity={0.75}
        />
      )}
      {/* grid lines */}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * cell}
          x2={W}
          y2={i * cell}
          stroke="#5fd0ff"
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * cell}
          y1={0}
          x2={i * cell}
          y2={H}
          stroke="#5fd0ff"
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      ))}
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} fill="none" stroke="#5fd0ff" strokeOpacity={0.7} />
    </svg>
  );
}
