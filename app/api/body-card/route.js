export async function GET() {
  const width = 1100;
  const height = 520;

  const svg = `
  <svg
    width="100%"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="GitHub profile body card"
  >
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050505" />
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>

      <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#090909" />
        <stop offset="100%" stop-color="#070707" />
      </linearGradient>

      <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03" />
      </linearGradient>

      <style>
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.6s ease forwards;
        }

        .slide-up {
          opacity: 0;
          transform: translateY(10px);
          animation: slideUp 0.6s ease forwards;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    </defs>

    <!-- outer -->
    <rect width="100%" height="100%" rx="20" fill="url(#bg)" />
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="20" fill="none" stroke="#1f1f1f" />

    <!-- inner panel -->
    <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="16" fill="url(#panel)" stroke="#1a1a1a" />

    <!-- top section titles -->
    <text x="54" y="64" fill="#fafafa" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" class="slide-up">
      Contact
    </text>

    <text x="560" y="64" fill="#fafafa" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" class="slide-up">
      About me
    </text>

    <!-- contact cards -->
    <g class="fade-in" style="animation-delay:0.15s">
      <rect x="54" y="88" width="210" height="52" rx="14" fill="#0d0d0d" stroke="#242424" />
      <text x="74" y="120" fill="#a1a1aa" font-size="14" font-family="Arial, Helvetica, sans-serif">Gmail</text>
      <text x="132" y="120" fill="#fafafa" font-size="14" font-family="Arial, Helvetica, sans-serif" font-weight="700">whitejungle2@gmail.com</text>

      <rect x="280" y="88" width="180" height="52" rx="14" fill="#0d0d0d" stroke="#242424" />
      <text x="300" y="120" fill="#a1a1aa" font-size="14" font-family="Arial, Helvetica, sans-serif">Discord</text>
      <text x="372" y="120" fill="#fafafa" font-size="14" font-family="Arial, Helvetica, sans-serif" font-weight="700">BLS</text>
    </g>

    <!-- about box -->
    <g class="fade-in" style="animation-delay:0.22s">
      <rect x="560" y="88" width="486" height="110" rx="14" fill="#0d0d0d" stroke="#242424" />
      <text x="586" y="124" fill="#d4d4d8" font-size="16" font-family="Arial, Helvetica, sans-serif">
        안녕하세요,
      </text>
      <text x="586" y="152" fill="#d4d4d8" font-size="16" font-family="Arial, Helvetica, sans-serif">
        꾸준한 기록과 학습을 통해 성장하는
      </text>
      <text x="586" y="180" fill="#fafafa" font-size="16" font-family="Arial, Helvetica, sans-serif" font-weight="700">
        신입 백엔드 개발자 백현빈입니다.
      </text>
    </g>

    <!-- divider -->
    <line
      x1="54"
      y1="236"
      x2="${width - 54}"
      y2="236"
      stroke="url(#lineGlow)"
      stroke-width="1.2"
    />

    <!-- tech stacks title -->
    <text x="54" y="278" fill="#fafafa" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" class="slide-up" style="animation-delay:0.28s">
      Tech Stacks
    </text>

    <!-- category labels -->
    <text x="54" y="314" fill="#a1a1aa" font-size="14" font-family="Arial, Helvetica, sans-serif">Backend</text>
    <text x="54" y="382" fill="#a1a1aa" font-size="14" font-family="Arial, Helvetica, sans-serif">Database / Frontend</text>
    <text x="54" y="450" fill="#a1a1aa" font-size="14" font-family="Arial, Helvetica, sans-serif">DevOps / Tools</text>

    <!-- backend pills -->
    ${pill(54, 326, 70, "Java", "#ED8B00")}
    ${pill(132, 326, 82, "Spring", "#6DB33F")}
    ${pill(222, 326, 110, "SpringBoot", "#6DB33F")}
    ${pill(340, 326, 122, "SpringSecurity", "#6DB33F")}
    ${pill(470, 326, 94, "SpringData", "#6DB33F")}
    ${pill(572, 326, 56, "JPA", "#59666C")}
    ${pill(636, 326, 74, "MyBatis", "#BF1A2F")}

    <!-- db / frontend -->
    ${pill(54, 394, 74, "MySQL", "#4479A1")}
    ${pill(136, 394, 70, "Redis", "#DC382D")}
    ${pill(214, 394, 94, "MongoDB", "#47A248")}
    ${pill(324, 394, 70, "HTML", "#E34F26")}
    ${pill(402, 394, 60, "CSS", "#663399")}
    ${pill(470, 394, 96, "JavaScript", "#2E2E2E", "#F7DF1E")}
    ${pill(574, 394, 62, "Vue", "#4FC08D")}
    ${pill(644, 394, 68, "Nuxt", "#00DC82")}
    ${pill(720, 394, 112, "TailwindCSS", "#06B6D4")}
    ${pill(840, 394, 62, "Pinia", "#2E2E2E", "#FFD859")}

    <!-- devops / tools -->
    ${pill(54, 462, 78, "Docker", "#2496ED")}
    ${pill(140, 462, 72, "Nginx", "#009639")}
    ${pill(220, 462, 58, "AWS", "#FF9900")}
    ${pill(294, 462, 88, "IntelliJ", "#000000")}
    ${pill(390, 462, 84, "VS Code", "#007ACC")}
    ${pill(482, 462, 52, "Git", "#F05032")}
    ${pill(542, 462, 78, "GitHub", "#181717")}
    ${pill(628, 462, 74, "Notion", "#000000")}
    ${pill(710, 462, 64, "Slack", "#4A154B")}
    ${pill(782, 462, 56, "Jira", "#0052CC")}
  </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function pill(x, y, w, text, fill, textColor = "#ffffff") {
  return `
    <g class="fade-in" style="animation-delay:0.34s">
      <rect x="${x}" y="${y}" width="${w}" height="34" rx="17" fill="${fill}" />
      <text
        x="${x + w / 2}"
        y="${y + 22}"
        text-anchor="middle"
        fill="${textColor}"
        font-size="13"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="700"
      >
        ${text}
      </text>
    </g>
  `;
}