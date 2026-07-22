# 배포 가이드 (Supabase + Vercel)

## 1. Supabase 프로젝트 만들기

1. https://supabase.com 에서 새 프로젝트를 만듭니다(리전은 Seoul 있으면 Seoul 선택).
2. 왼쪽 메뉴 SQL Editor에 들어가서, 이 폴더의 `schema.sql` 내용을 그대로 붙여넣고 실행합니다. `entries` 테이블이 생성됩니다.
3. 왼쪽 메뉴 Project Settings > API로 이동해서 두 값을 복사해둡니다.
   - Project URL
   - anon public key

## 2. 로컬에서 먼저 확인 (선택)

```bash
cd ai-archive-webapp
cp .env.example .env.local
# .env.local을 열어서 위에서 복사한 두 값을 채워넣습니다.
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 갤러리가 뜨는지 확인합니다(아직 데이터가 없어서 빈 상태로 보이는 게 정상입니다).

## 3. GitHub에 올리기

```bash
cd ai-archive-webapp
git init
git add .
git commit -m "AI 대화 아카이빙 웹앱 초기 버전"
git branch -M main
git remote add origin <내 GitHub 저장소 주소>
git push -u origin main
```

(이미 만들어둔 저장소가 있다면 `git remote add` 대신 그 저장소 안에 이 폴더 내용을 넣고 커밋하시면 됩니다.)

## 4. Vercel에 배포

1. https://vercel.com 대시보드에서 "Add New" > "Project"를 선택합니다.
2. 방금 push한 GitHub 저장소를 Import 합니다.
3. Environment Variables에 아래 두 개를 추가합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy를 누릅니다. 몇 분 뒤 `https://프로젝트이름.vercel.app` 같은 주소가 생깁니다.

## 5. 확인

배포된 주소로 접속해서, Claude에게 "이 답변 북마크해줘"라고 요청했을 때(추후 스킬이 이 API를 호출하도록 연결하면) 카드가 쌓이는지 확인합니다. 지금 단계에서는 API(`/api/entries`)가 열려있는 상태라, Postman이나 curl로 직접 테스트해볼 수도 있습니다.

```bash
curl -X POST https://프로젝트이름.vercel.app/api/entries \
  -H "Content-Type: application/json" \
  -d '{"main":"claude","sub":"cowork","topic":"research","title":"테스트","content":"배포 테스트 항목입니다.","entry_date":"2026-07-22"}'
```

## 참고 — 지금 빠져 있는 것

- **접근 제어 없음**: 요청하신 대로 지금은 비밀번호 보호를 넣지 않았습니다. 배포 주소를 아는 사람은 누구나 API를 호출할 수 있으니, 회사 업무 내용이 쌓이기 시작하면 이후에 간단한 비밀번호 게이트를 추가하는 걸 권장합니다.
- **Claude 연동**: 지금은 API만 만들어진 상태이고, 실제로 Claude가 "북마크해줘" 요청을 받았을 때 로컬 파일이 아니라 이 API를 호출하도록 스킬을 다시 연결하는 작업이 남아있습니다.
- **맥락(스레드) 저장**: 이전에 논의했던 "답변 1개가 아니라 대화 전체 저장" 기능은 이번 작업 범위에서 빠졌습니다. 나중에 원하시면 `entries` 테이블에 타입 구분 컬럼을 추가해서 이어갈 수 있습니다.
