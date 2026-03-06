export async function GET() {
  const width = 1100;
  const height = 200;

  const title = "HyeonBin's GitHub";
  const subtitle = "Backend Developer";

  const svg = `
  <svg
    width="100%"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >

    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050505" />
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>

      <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
      </linearGradient>

      <style>
        .fade {
          opacity: 0;
          animation: fade 0.6s ease forwards;
        }

        .slide {
          opacity: 0;
          transform: translateY(10px);
          animation: slide 0.6s ease forwards;
        }

        .slide-delay {
          opacity: 0;
          transform: translateY(10px);
          animation: slide 0.6s ease forwards;
          animation-delay: .12s;
        }

        @keyframes fade {
          to { opacity:1 }
        }

        @keyframes slide {
          to {
            opacity:1;
            transform: translateY(0);
          }
        }
      </style>

    </defs>

    <!-- background -->
    <rect width="100%" height="100%" rx="18" fill="url(#bg)" />
    <rect x="0.5" y="0.5" width="${width-1}" height="${height-1}" rx="18" fill="none" stroke="#1f1f1f"/>

    <!-- inner panel -->
    <rect x="18" y="18" width="${width-36}" height="${height-36}" rx="16" fill="#070707" stroke="#1a1a1a"/>

    <!-- icon -->
    <g class="fade">

      <!-- icon background -->
      <rect
        x="54"
        y="64"
        width="52"
        height="52"
        rx="14"
        fill="#0d0d0d"
        stroke="#262626"
      />

      <!-- < -->
      <path
        d="M76 80 L68 90 L76 100"
        stroke="#60a5fa"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- > -->
      <path
        d="M84 80 L92 90 L84 100"
        stroke="#c084fc"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

    </g>

    <!-- title -->
    <text
      x="128"
      y="98"
      fill="#fafafa"
      font-size="42"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="700"
      class="slide"
    >
      ${title}
    </text>

    <!-- subtitle -->
    <text
      x="130"
      y="132"
      fill="#8b8b93"
      font-size="18"
      font-family="Arial, Helvetica, sans-serif"
      class="slide-delay"
    >
      ${subtitle}
    </text>

    <!-- bottom divider -->
    <line
      x1="54"
      y1="156"
      x2="${width-54}"
      y2="156"
      stroke="url(#lineGlow)"
      stroke-width="1.2"
    />

  </svg>
  `;

  return new Response(svg,{
    headers:{
      "Content-Type":"image/svg+xml",
      "Cache-Control":"s-maxage=3600, stale-while-revalidate"
    }
  });
}