import { useAxios } from "./utils/axios";
import fs from "fs";
import dotenv from "dotenv";
import { commitFile } from "./utils/exec";

dotenv.config();

const PROGRAMMERS_SIGN_IN = "https://programmers.co.kr/api/v1/account/sign-in";
const PROGRAMMERS_USER_RECORD = "https://programmers.co.kr/api/v1/users/record";

async function main() {
  // 1) 환경변수
  const id = process.env.PROGRAMMERS_TOKEN_ID || "";
  const pw = process.env.PROGRAMMERS_TOKEN_PW || "";
  let my_data: any = null;

  // 2) 로그인 & 데이터 조회
  try {
    let res = await useAxios(PROGRAMMERS_SIGN_IN, "POST", {
      user: { email: id, password: pw },
    });
    if (res.data !== null) {
      res = await useAxios(
        PROGRAMMERS_USER_RECORD,
        "GET",
        undefined,
        res.headers["set-cookie"]
      );
      my_data = res.data;
    }
  } catch (e) {
    console.error("axios error: " + e);
    return;
  }

  if (!my_data) return;

  // 3) 데이터 가드 & 포맷
  const level = my_data?.skillCheck?.level ?? 0;
  const score = Number(my_data?.ranking?.score ?? 0);
  const rank = Number(my_data?.ranking?.rank ?? 0);
  const solved = Number(my_data?.codingTest?.solved ?? 0);

  const maxProblems = 300; // 진행바 기준값(원하면 수정)
  const progress = Math.max(0, Math.min(solved / maxProblems, 1));
  const barWidth = 460 * progress;
  const percent = Math.round(progress * 100);

  // 4) 트렌디 다크 카드 SVG
  const str = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="210" viewBox="0 0 600 210" fill="none" xmlns="http://www.w3.org/2000/svg">

  <!-- 배경 그라디언트 & 글로우 -->
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="600" y2="210" gradientUnits="userSpaceOnUse">
      <stop offset="0%"  stop-color="#16181d"/>
      <stop offset="100%" stop-color="#0f1217"/>
    </linearGradient>

    <linearGradient id="card-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
    </linearGradient>

    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"  stop-color="#69b1ff"/>
      <stop offset="100%" stop-color="#3a86ff"/>
    </linearGradient>

    <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/>
    </filter>

    <filter id="inner-glow">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feBlend in="SourceGraphic" in2="blur" mode="screen"/>
    </filter>
  </defs>

  <!-- 전체 카드 -->
  <rect x="10" y="10" width="580" height="190" rx="16" fill="url(#bg-grad)" stroke="rgba(255,255,255,0.08)" filter="url(#soft-shadow)"/>

  <!-- 안쪽 유리 카드 2x2 -->
  <g>
    <rect x="28"  y="28"  width="260" height="70" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)"/>
    <rect x="312" y="28"  width="260" height="70" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)"/>
    <rect x="28"  y="108" width="260" height="70" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)"/>
    <rect x="312" y="108" width="260" height="70" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)"/>
  </g>

  <style>
    .title {
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
      font-weight: 600;
      font-size: 13px;
      fill: #cfd6e4;
      letter-spacing: 0.2px;
    }
    .value {
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
      font-weight: 800;
      font-size: 30px;
      fill: url(#accent);
      filter: url(#inner-glow);
    }
    .unit {
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
      font-weight: 700;
      font-size: 14px;
      fill: url(#accent);
    }
    .muted {
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Noto Sans KR", sans-serif;
      font-weight: 600;
      font-size: 12px;
      fill: #9aa3b2;
    }
  </style>

  <!-- 좌상: 레벨 -->
  <text x="46" y="50" class="title">정복 중인 레벨</text>
  <text x="46" y="85" class="value">${level}</text>
  <text x="86" y="85" class="unit">레벨</text>

  <!-- 우상: 점수 -->
  <text x="330" y="50" class="title">현재 점수</text>
  <text x="330" y="85" class="value">${score.toLocaleString("ko-KR")}</text>

  <!-- 좌하: 해결 문제 + 진행바 -->
  <text x="46" y="130" class="title">해결한 코딩 테스트</text>
  <text x="46" y="165" class="value">${solved}</text>
  <text x="108" y="165" class="unit">문제</text>

  <!-- 진행바(좌하 카드 하단에 걸치게) -->
  <g>
    <rect x="46" y="178" width="460" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
    <rect x="46" y="178" width="${barWidth}" height="6" rx="3" fill="url(#accent)"/>
    <text x="520" y="183" class="muted" text-anchor="end">${solved} / ${maxProblems} · ${percent}%</text>
  </g>

  <!-- 우하: 랭킹 -->
  <text x="330" y="130" class="title">나의 랭킹</text>
  <text x="330" y="165" class="value">${rank.toLocaleString("ko-KR")}</text>
  <text x="420" y="165" class="unit">위</text>

</svg>`;

  // 5) 파일 저장 & 커밋
  const out = __dirname + "/result.svg";
  fs.writeFileSync(out, str);
  await commitFile(out);

  console.log("success");
}

main();
