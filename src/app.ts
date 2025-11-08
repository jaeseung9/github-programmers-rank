const maxProblems = 300; // 진행바 기준값 (원하면 수정 가능)
const progress = Math.min(my_data.codingTest.solved / maxProblems, 1);
const progressWidth = 420 * progress;

const str = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="560" height="180" viewBox="0 0 560 180" fill="none" xmlns="http://www.w3.org/2000/svg">

<defs>
<linearGradient id="grad-bg" x1="0" y1="0" x2="560" y2="0">
  <stop offset="0%" stop-color="#1a1b1f"/>
  <stop offset="100%" stop-color="#44454d"/>
</linearGradient>
</defs>

<rect width="560" height="180" rx="14" fill="url(#grad-bg)" stroke="rgba(255,255,255,0.08)" />

<style>
.title {
  font-family: "Segoe UI", sans-serif;
  font-size: 14px;
  font-weight: 500;
  fill: #e5e5e5;
}
.value {
  font-family: "Segoe UI", sans-serif;
  font-size: 26px;
  font-weight: 700;
  fill: #4da3ff;
}
.sub {
  font-family: "Segoe UI", sans-serif;
  font-size: 14px;
  fill: #4da3ff;
  font-weight: 600;
}
.label {
  font-family: "Segoe UI", sans-serif;
  font-size: 13px;
  fill: #cfcfcf;
}
</style>

<!-- Level -->
<text x="40" y="55" class="title">정복 중인 레벨</text>
<text x="40" y="88" class="value">${my_data.skillCheck.level}</text>
<text x="85" y="88" class="sub">레벨</text>

<!-- Score -->
<text x="300" y="55" class="title">현재 점수</text>
<text x="300" y="88" class="value">${my_data.ranking.score.toLocaleString('ko-KR')}</text>

<!-- Solved -->
<text x="40" y="130" class="title">해결한 코딩 테스트</text>
<text x="40" y="160" class="value">${my_data.codingTest.solved}</text>
<text x="110" y="160" class="sub">문제</text>

<!-- Rank -->
<text x="300" y="130" class="title">나의 랭킹</text>
<text x="300" y="160" class="value">${my_data.ranking.rank.toLocaleString('ko-KR')}</text>
<text x="380" y="160" class="sub">위</text>

<!-- Progress Bar -->
<rect x="40" y="170" width="420" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
<rect x="40" y="170" width="${progressWidth}" height="6" rx="3" fill="#4da3ff"/>
<text x="470" y="175" class="label" text-anchor="end">${my_data.codingTest.solved} / ${maxProblems}</text>

</svg>`;
