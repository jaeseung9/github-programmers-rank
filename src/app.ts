import { useAxios } from "./utils/axios"
import fs from 'fs'
import dotenv from 'dotenv'
import { commitFile } from "./utils/exec"
dotenv.config()

const PROGRAMMERS_SIGN_IN = 'https://programmers.co.kr/api/v1/account/sign-in'
const PROGRAMMERS_USER_RECORD = 'https://programmers.co.kr/api/v1/users/record'

async function main() {
    // 환경 변수를 가져옴
    let id = process.env.PROGRAMMERS_TOKEN_ID || ''
    let pw = process.env.PROGRAMMERS_TOKEN_PW || ''
    let my_data = null;

    // 프로그래머스 로그인
    try {
        let res = await useAxios(PROGRAMMERS_SIGN_IN, "POST", {"user":{"email": id,"password": pw}})
        if (res.data !== null) {
            res = await useAxios(PROGRAMMERS_USER_RECORD, "GET", undefined, res.headers["set-cookie"]);
            my_data = res.data
        }
    } catch (e) {
        console.error('axios error: ' + e)
        return;
    }
    
    if (my_data !== null) {
        let str = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="550" height="180" viewBox="0 0 550 180" fill="none" xmlns="http://www.w3.org/2000/svg">

<style>
.card {
  fill: #ffffff;
  stroke: #dbe7ff;
  stroke-width: 1.6;
  rx: 12;
}
.title {
  font-size: 12px;
  font-weight: 600;
  fill: #4b4b4b;
  font-family: "Segoe UI", sans-serif;
}
.value {
  font-size: 26px;
  font-weight: 700;
  fill: #0078ff;
  font-family: "Segoe UI", sans-serif;
}
.sub {
  font-size: 13px;
  font-weight: 600;
  fill: #0078ff;
  font-family: "Segoe UI", sans-serif;
}
</style>

<!-- 배경 -->
<rect width="550" height="180" fill="#f7faff"/>

<!-- 카드 1 -->
<rect x="25" y="25" width="230" height="60" class="card"/>
<text x="45" y="50" class="title">정복 중인 레벨</text>
<text x="45" y="80" class="value">${my_data.skillCheck.level}</text>
<text x="85" y="80" class="sub">레벨</text>

<!-- 카드 2 -->
<rect x="295" y="25" width="230" height="60" class="card"/>
<text x="315" y="50" class="title">현재 점수</text>
<text x="315" y="80" class="value">${my_data.ranking.score.toLocaleString('ko-KR')}</text>

<!-- 카드 3 -->
<rect x="25" y="105" width="230" height="60" class="card"/>
<text x="45" y="130" class="title">해결한 코딩 테스트</text>
<text x="45" y="160" class="value">${my_data.codingTest.solved}</text>
<text x="95" y="160" class="sub">문제</text>

<!-- 카드 4 -->
<rect x="295" y="105" width="230" height="60" class="card"/>
<text x="315" y="130" class="title">나의 랭킹</text>
<text x="315" y="160" class="value">${my_data.ranking.rank.toLocaleString('ko-KR')}</text>
<text x="390" y="160" class="sub">위</text>

</svg>
`;
        `

        fs.writeFileSync(__dirname + '/result.svg', str)
        await commitFile(__dirname + '/result.svg')

        console.log('success')
    }
}

main();
