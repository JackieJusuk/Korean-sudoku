import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 앱인토스 콘솔에 등록한 appName과 동일하게 맞춰주세요. (딥링크 intoss://{appName}에도 사용)
  appName: 'korean-jamo-sudoku',
  brand: {
    primaryColor: '#3182F6',
  },
  webView: {},
  // 게임 카테고리로 제출하면 콘솔에서 게임용 내비게이션 바(더보기/닫기 버튼)가 자동 적용됩니다.
  // 게임 미니앱은 콘텐츠가 내비게이션 바 아래까지 이어지도록 투명 배경을 권장합니다.
  navigationBar: {
    transparentBackground: true,
    withTitle: false,
  },
  permissions: [],
  webBundleDir: 'dist',
});
