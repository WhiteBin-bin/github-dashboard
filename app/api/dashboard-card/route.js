import { getDashboardData } from "../../../lib/dashboard-data";

export async function GET() {
  const data = await getDashboardData();

  const width = 1100;
  const height = 240;

  const graphBox = { x: 16, y: 16, w: 760, h: 208 };
  const statsBox = { x: 792, y: 16, w: 292, h: 208 };

  const chart = {
    x: graphBox.x + 24,
    y: graphBox.y + 42,
    w: graphBox.w - 48,
    h: 124,
  };

  const max = Math.max(...data.graph.map((d) => d.value), 1);

  const points = data.graph.map((item, index) => {
    const x = chart.x + (index * chart.w) / (data.graph.length - 1);
    const y = chart.y + chart.h - (item.value / max) * chart.h;
    return { x, y, value: item.value, label: item.label };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const areaPoints = [
    `${chart.x},${chart.y + chart.h}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${chart.x + chart.w},${chart.y + chart.h}`,
  ].join(" ");

  const ySteps = 4;
  const yGrid = Array.from({ length: ySteps + 1 }, (_, i) => {
    const ratio = i / ySteps;
    const y = chart.y + chart.h - chart.h * ratio;
    return `
      <line
        x1="${chart.x}"
        y1="${y}"
        x2="${chart.x + chart.w}"
        y2="${y}"
        stroke="#1f1f1f"
        stroke-width="1"
      />
    `;
  }).join("");

  const xGrid = points.map((p) => `
    <line
      x1="${p.x}"
      y1="${chart.y}"
      x2="${p.x}"
      y2="${chart.y + chart.h}"
      stroke="#141414"
      stroke-width="1"
    />
  `).join("");

  const circles = points
    .map(
      (p, index) => `
      <circle
        class="point"
        cx="${p.x}"
        cy="${p.y}"
        r="2.3"
        fill="#f5f5f5"
        style="animation-delay:${0.85 + index * 0.03}s"
      />
    `
    )
    .join("");

  const xLabels = points
    .filter((_, i) => i % 2 === 0)
    .map((p) => `
      <text
        x="${p.x}"
        y="${chart.y + chart.h + 18}"
        font-size="9"
        text-anchor="middle"
        fill="#5f5f5f"
        font-family="Arial, Helvetica, sans-serif"
      >
        ${p.label}
      </text>
    `)
    .join("");

  const statRows = [
    { label: `${data.year} Commits`, value: data.commits },
    { label: "Total PRs", value: data.prs },
    { label: "Total Issues", value: data.issues },
    { label: "Contributed to", value: data.contributedTo },
  ];

  const statsMarkup = statRows
    .map((row, index) => {
      const baseY = statsBox.y + 66 + index * 36;
      const dividerY = baseY + 18;

      return `
        <g class="stats-row" style="animation-delay:${0.35 + index * 0.12}s">
          <text
            x="${statsBox.x + 18}"
            y="${baseY}"
            fill="#a1a1aa"
            font-size="13"
            font-family="Arial, Helvetica, sans-serif"
          >
            ${row.label}
          </text>

          <text
            x="${statsBox.x + statsBox.w - 18}"
            y="${baseY}"
            fill="#fafafa"
            font-size="14"
            text-anchor="end"
            font-family="Arial, Helvetica, sans-serif"
            font-weight="700"
          >
            ${row.value}
          </text>

          ${
            index !== statRows.length - 1
              ? `<line
                  x1="${statsBox.x + 18}"
                  y1="${dividerY}"
                  x2="${statsBox.x + statsBox.w - 18}"
                  y2="${dividerY}"
                  stroke="#1f1f1f"
                  stroke-width="1"
                />`
              : ""
          }
        </g>
      `;
    })
    .join("");

  const svg = `
  <svg
    width="100%"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="GitHub dashboard card"
  >
    <defs>
      <linearGradient id="card-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050505" />
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>

      <linearGradient id="panel-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b0b0b" />
        <stop offset="100%" stop-color="#090909" />
      </linearGradient>

      <linearGradient id="graph-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>

      <style>
        .card-fade {
          opacity: 0;
          animation: cardFade 0.45s ease forwards;
        }

        .line-path {
          stroke-dasharray: 1600;
          stroke-dashoffset: 1600;
          animation: drawLine 1.6s ease forwards;
          animation-delay: 0.2s;
        }

        .point {
          opacity: 0;
          animation: fadePoint 0.28s ease forwards;
        }

        .stats-row {
          opacity: 0;
          transform: translateY(8px);
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadePoint {
          to {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFade {
          to {
            opacity: 1;
          }
        }
      </style>
    </defs>

    <g class="card-fade">
      <rect width="100%" height="100%" rx="18" fill="url(#card-bg)" />
      <rect
        x="0.5"
        y="0.5"
        width="${width - 1}"
        height="${height - 1}"
        rx="18"
        fill="none"
        stroke="#1f1f1f"
      />

      <!-- Left panel -->
      <rect
        x="${graphBox.x}"
        y="${graphBox.y}"
        width="${graphBox.w}"
        height="${graphBox.h}"
        rx="14"
        fill="url(#panel-bg)"
        stroke="#1f1f1f"
      />

      <text
        x="${graphBox.x + 18}"
        y="${graphBox.y + 26}"
        fill="#fafafa"
        font-size="14"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="700"
      >
        ${data.title}
      </text>

      <text
        x="${graphBox.x + graphBox.w - 18}"
        y="${graphBox.y + 26}"
        fill="#525252"
        font-size="11"
        text-anchor="end"
        font-family="Arial, Helvetica, sans-serif"
      >
        ${data.period}
      </text>

      <line
        x1="${graphBox.x + 18}"
        y1="${graphBox.y + 36}"
        x2="${graphBox.x + graphBox.w - 18}"
        y2="${graphBox.y + 36}"
        stroke="#1a1a1a"
        stroke-width="1"
      />

      ${yGrid}
      ${xGrid}

      <polygon
        points="${areaPoints}"
        fill="url(#graph-area)"
      />

      <polyline
        class="line-path"
        fill="none"
        stroke="#f5f5f5"
        stroke-width="2.3"
        stroke-linecap="round"
        stroke-linejoin="round"
        points="${polylinePoints}"
      />

      ${circles}
      ${xLabels}

      <!-- Stats panel -->
      <rect
        x="${statsBox.x}"
        y="${statsBox.y}"
        width="${statsBox.w}"
        height="${statsBox.h}"
        rx="14"
        fill="url(#panel-bg)"
        stroke="#1f1f1f"
      />

      <text
        x="${statsBox.x + 18}"
        y="${statsBox.y + 26}"
        fill="#fafafa"
        font-size="14"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="700"
      >
        Stats
      </text>

      <text
        x="${statsBox.x + statsBox.w - 18}"
        y="${statsBox.y + 26}"
        fill="#525252"
        font-size="11"
        text-anchor="end"
        font-family="Arial, Helvetica, sans-serif"
      >
        Overview
      </text>

      <line
        x1="${statsBox.x + 18}"
        y1="${statsBox.y + 36}"
        x2="${statsBox.x + statsBox.w - 18}"
        y2="${statsBox.y + 36}"
        stroke="#1a1a1a"
        stroke-width="1"
      />

      <g
        transform="translate(${statsBox.x + statsBox.w - 92}, ${statsBox.y + 94}) scale(3.1)"
        opacity="0.08"
        fill="#ffffff"
      >
        <path d="M12 .5C5.65.5.5 5.64.5 12c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.55
        0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67
        -1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24
        3.32.95.1-.74.4-1.24.72-1.52-2.56-.29-5.26-1.28-5.26-5.69
        0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18
        .91-.25 1.88-.37 2.84-.37.96 0 1.93.12 2.84.37
        2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05
        .73.8 1.18 1.82 1.18 3.08
        0 4.42-2.7 5.39-5.28 5.68.41.36.77 1.08.77 2.18
        0 1.58-.01 2.86-.01 3.25
        0 .3.21.66.79.55A11.52 11.52 0 0023.5 12
        C23.5 5.64 18.35.5 12 .5z"/>
      </g>

      ${statsMarkup}
    </g>
  </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}