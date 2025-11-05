import fs from 'fs';
import path from 'path';

export const resetE2EDatabase = () => {
  const dbPath = path.join(process.cwd(), 'src/__mocks__/response/e2e.json');
  const initialData = {
    events: [],
  };

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
};

// 테스트용 이벤트 데이터 추가 함수
export const seedE2EDatabase = (events: Event[]) => {
  const dbPath = path.join(process.cwd(), 'src/__mocks__/response/e2e.json');
  const data = { events };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// 각 테스트마다 자동으로 DB 초기화하는 커스텀 테스트
// export const test = base.extend({
//   // 각 테스트 시작 전에 E2E DB 초기화
//   page: async ({ page }, use) => {
//     // 테스트 시작 전 DB 초기화
//     resetE2EDatabase();

//     // 페이지 사용
//     await use(page);

//     // 테스트 종료 후 정리 (필요시)
//     // resetE2EDatabase();
//   },
// });
