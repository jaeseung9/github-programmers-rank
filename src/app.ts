import { useAxios } from "./utils/axios"
import fs from 'fs'
import dotenv from 'dotenv'
import { commitFile } from "./utils/exec"
dotenv.config()

const PROGRAMMERS_SIGN_IN = 'https://programmers.co.kr/api/v1/account/sign-in'
const PROGRAMMERS_USER_RECORD = 'https://programmers.co.kr/api/v1/users/record'

async function main() {
    let id = process.env.PROGRAMMERS_TOKEN_ID || ''
    let pw = process.env.PROGRAMMERS_TOKEN_PW || ''
    let my_data = null;

    try {
        let res = await useAxios(PROGRAMMERS_SIGN_IN, "POST", {"user": {"email": id, "password": pw}})
        if (res.data !== null) {
            res = await useAxios(PROGRAMMERS_USER_RECORD, "GET", undefined, res.headers["set-cookie"]);
            my_data = res.data
        }
    } catch (e) {
        console.error('axios error: ' + e)
        return;
    }

    if (my_data !== null) {

        const maxProblems = 300; // 진행바 기준값
        const progress = Math.min(my_data.codingTest.solved / maxProblems, 1);
        const progressWidth = 420 * progress;

      const maxProblems = 300;
const progress = Math.min(my_data.codingTest.solved / maxProblems, 1);
const bar = 420 * progress;

const str = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="460" height="160" viewBox="0 0 460 160" fill="none" xmlns="http://www.w3.org/2000/svg">

<defs>
<linearGradient id="bg" x1="0" y1="0" x2="460" y2="160">
  <stop offset="0%" stop-color="#1e1f23"/>
  <stop offset="100%" stop-color="#2a2b31"/>
</linearGradient>
</defs>

<rect width="460" height="160" rx="16" fill="url(#bg)" stroke="rgba(255,255,255,0.06)" />

<style>
.t1 { font-family: 'Segoe UI', sans-serif; font-size: 32px; font-weight: 700; fill:#4da3ff }
.t2 { font-family: 'Segoe UI', sans-serif; font-size: 14px; fill:#bfc4d4 }
.t3 { font-family: 'Segoe UI', sans-serif; font-size: 16px; font-weight:600; fill:#4da3ff }
</style>

<!-- 유저명 -->
<text x="26" y="42" class="t1">${my_data.skillCheck.level}레벨</text>
<text x="26" y="64" class="t2">Level</text>

<!-- Score -->
<text x="160" y="42" class="t1">${my_data.ranking.score.toLocaleString('ko-KR')}</text>
<text x="160" y="64" class="t2">Score</text>

<!-- Rank -->
<text x="300" y="42" class="t1">${my_data.ranking.rank.toLocaleString('ko-KR')}위</text>
<text x="300" y="64" class="t2">Rank</text>

<!-- Solved -->
<text x="26" y="115" class="t3">${my_data.codingTest.solved} solved</text>

<!-- Progress bar -->
<rect x="26" y="122" width="420" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
<rect x="26" y="122" width="${bar}" height="6" rx="3" fill="#4da3ff"/>
<text x="446" y="130" class="t2" text-anchor="end">${my_data.codingTest.solved} / ${maxProblems}</text>

</svg>`;

        fs.writeFileSync(__dirname + '/result.svg', str)
        await commitFile(__dirname + '/result.svg')

        console.log('success ✅')
    }
}

main();
