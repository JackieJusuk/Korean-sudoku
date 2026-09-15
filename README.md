# 한글 자모 수도쿠 (Korean Jamo Sudoku)

일반 9x9 수도쿠의 변형으로, 숫자 1~9 대신 한글 자음 9개(`ㄱㄴㄷㄹㅁㅂㅅㅇㅈ`)를 사용하는 퍼즐 게임입니다.
각 행·열·3x3 박스에 9개 자모가 겹치지 않게 배치하는 규칙은 동일합니다.

앱인토스(App-in-Toss) WebView 미니앱으로 출시하는 것을 목표로 개발 초기 단계부터
[앱인토스 개발자센터](https://developers-apps-in-toss.toss.im) 규격과 출시 정책을 반영하고 있습니다.

## 기술 스택

- React + TypeScript + Vite
- `@apps-in-toss/web-framework` (App-in-Toss WebView SDK 3.x)
- 순수 클라이언트 렌더링(SSR 미사용)

## 실행 방법

```bash
npm install
npm run dev       # 로컬 브라우저에서 확인 (우측 하단 AIT Devtools로 미니앱 동작 테스트)
npm run build      # 프로덕션 빌드 + 앱인토스 .ait 번들 생성 (프로젝트 루트에 생성됨)
```

> ⚠️ App-in-Toss CLI(`@apps-in-toss/cli`, `@apps-in-toss/devtools`)는 **Node.js 24 이상**을 요구합니다.
> `nvm install 24 && nvm use 24` 로 전환 후 설치/빌드해 주세요.

### 토스 앱 실기기 테스트 (QR)

1. `npm run build` 실행 → 프로젝트 루트에 `korean-jamo-sudoku.ait` 생성
2. [앱인토스 콘솔](https://developers-apps-in-toss.toss.im)에 로그인 → 해당 앱 → `.ait` 파일 업로드
3. 콘솔의 **"테스트하기"** 버튼을 누르면 표시되는 QR을 토스 앱으로 스캔
   (테스트 스킴: `intoss-private://appsintoss?_deploymentId=...`)

콘솔 업로드/로그인이 필요한 단계라 로컬 CLI만으로는 QR을 만들 수 없습니다. `.ait` 빌드까지는
이 저장소에서 자동화되어 있고, 업로드·QR 생성은 콘솔 접근 권한이 있는 담당자가 직접 진행해야 합니다.

## 폴더 구조

```
src/
  game/            # 순수 게임 로직 (프레임워크 비의존)
    constants.ts   # 보드 크기, 자모 매핑
    types.ts       # Difficulty, Grid 등 공용 타입
    sudokuCore.ts   # 백트래킹 솔버 / 해 생성 / 유일해 검증
    generator.ts    # 난이도별 퍼즐 생성 (generatePuzzle)
    validator.ts    # 행/열/박스 충돌 검사, 완성 여부 판정
  hooks/
    useSudoku.ts     # 보드 상태, 선택 셀, 입력 처리
  components/
    Board.tsx            # 9x9 보드
    JamoKeypad.tsx        # 자모 입력 키패드
    DifficultySelector.tsx # 난이도 선택 (쉬움/보통/어려움)
  App.tsx
apps-in-toss.config.ts  # App-in-Toss 설정 (appName, navigationBar 등)
```

## 앱인토스 출시 체크리스트

### ✅ 이번 단계에서 반영 완료

- **WebView 방식**: React + TypeScript + Vite, `@apps-in-toss/web-framework` 연동, `apps-in-toss.config.ts` 설정
  (SDK 3.x 기준 — 구버전 `granite.config.ts`가 아닌 `apps-in-toss.config.ts` 사용)
- **게임 콘텐츠**: 선정성·폭력성·불법조장·도박/약물·자살/자해 등 민감 콘텐츠 없음
- **로그인/결제/광고 미사용**: 임의 소셜로그인, PG 직접 연동, 인앱 광고 없음 (광고는 추후 별도 논의)
- **외부 링크/자사 앱 설치 유도 없음**: 앱 내에서 외부 사이트로 강제 이동하는 로직 없음
- **뒤로가기/나가기**: 자체 모달·팝업으로 시스템 뒤로가기/닫기를 가로막지 않음. 게임용 내비게이션 바
  (`navigationBar.transparentBackground: true`)를 사용해 앱인토스가 제공하는 더보기/닫기(X) 버튼을 그대로 노출
- **다크패턴 없음**: 강제 노출 팝업, 클릭 유도 UI 없음
- **사운드**: 이번 단계에는 사운드를 포함하지 않음 (추가 시 음소거/조절 옵션 필수로 함께 구현 예정)
- **보안**: 외부 스크립트 동적 로드 없음, `eval`/원격 코드 실행 없음, 순수 클라이언트 렌더링(SSR 미사용),
  외부 도메인으로의 리다이렉트/렌더링 없음
- **성능**: 초기 화면 10초 이내 로딩을 목표로 별도 런타임 UI 라이브러리 없이 최소 번들 구성
  (Vite 기본 코드 스플리팅 활용, 이미지 등 무거운 에셋 미사용)
- **번들 크기**: 현재 외부 이미지/폰트 등 대용량 에셋 없음 → 100MB 제한에 여유 있음

### 🔲 출시 전 별도로 처리해야 하는 항목 (이번 세션 범위 밖)

- **등급분류 증빙**: 자체등급분류 게임물 정보 또는 등급분류 증명서 PDF 준비 및 콘솔 제출
- **디자인 자산**: 로고, 썸네일, 스크린샷 등 앱인토스 규격에 맞는 PNG 제작
- **콘솔 앱 등록**: 앱인토스 콘솔에서 앱 생성, `appName`/카테고리(게임)/고객센터 링크/홈페이지 주소 등록
  (`apps-in-toss.config.ts`의 `appName`, `brand.primaryColor`를 콘솔 등록 값과 반드시 일치시켜야 함)
- **QR 테스트**: `.ait` 파일을 콘솔에 업로드 후 "테스트하기" QR로 토스 앱 실기기 테스트 (위 "토스 앱 실기기 테스트" 절 참고)
- **생성형 AI 콘텐츠 고지**: 향후 AI로 생성한 콘텐츠(이미지 등)를 추가할 경우 고지 문구 반영
- **성능 실측**: 실제 배포 환경(3G/LTE, 저사양 기기 포함)에서 10초 이내 로딩 재검증
- **난이도 밸런싱**: 현재 난이도별 given(초기 힌트) 개수는 임시값(쉬움 38 / 보통 30 / 어려움 24)이며,
  실제 플레이 테스트를 통한 조정 필요
- **디자인/애니메이션 다듬기**: 현재는 최소 기능 UI. 톤앤매너, 트랜지션 등은 다음 단계에서 진행
