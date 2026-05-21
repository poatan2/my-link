# 🔗 MyLink

MyLink는 여러 소셜 미디어 플랫폼과 웹사이트 링크를 하나의 페이지에 모아서 공유할 수 있는 **개인 맞춤형 프로필 링크 서비스**입니다. 사용자만의 고유한 링크를 만들고 자신을 효과적으로 표현해 보세요!

## ✨ 주요 기능

*   **사용자 인증 및 프로필 생성**: Firebase Auth를 기반으로 간편하게 로그인하고 고유한 사용자명(Username) 기반의 프로필 페이지를 생성합니다.
*   **직관적인 링크 관리**: 링크의 제목, URL, 썸네일 이미지를 손쉽게 등록, 수정, 삭제(CRUD)할 수 있습니다.
*   **링크 공개 설정 및 순서 변경**: 드래그 앤 드롭(Drag & Drop)으로 링크의 순서를 쉽게 변경하고, 토글 버튼으로 링크의 노출 여부를 즉각적으로 제어할 수 있습니다.
*   **실시간 미리보기 (Split-View)**: 데스크탑 환경에서는 좌측의 관리 대시보드와 우측의 실시간 미리보기가 나뉘어 제공되어, 변경 사항을 즉시 확인할 수 있습니다.
*   **통계 대시보드**: 방문자 통계와 개별 링크 클릭 수 등을 시각적인 차트 기반으로 확인하여 유입 반응을 분석할 수 있습니다.
*   **반응형 디자인**: 모바일 우선주의(Mobile-first) 접근 방식을 채택하여 모바일, 태블릿, 데스크탑 환경 어디서든 최적화된 UI와 부드러운 애니메이션을 제공합니다.

## 🛠️ 기술 스택

### Frontend
*   **Framework**: Next.js 16 (App Router)
*   **Library**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4, Shadcn UI
*   **Icons**: `@phosphor-icons/react`

### Backend (BaaS)
*   **Database & Storage**: Firebase (Authentication, Firestore, Storage)

## 🚀 로컬 실행 방법

프로젝트를 로컬 개발 환경에서 실행하려면 다음 단계를 진행해 주세요.

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고, 발급받은 Firebase 프로젝트 설정 값을 입력합니다.

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

### 3. 개발 서버 실행

```bash
npm run dev
```
개발 서버가 켜지면 브라우저에서 `http://localhost:3000`으로 접속하여 확인하실 수 있습니다.

## 📜 스크립트 명령어

*   `npm run dev`: 개발 서버 실행 (Turbopack 사용)
*   `npm run build`: 프로덕션용 최적화 빌드 생성
*   `npm run start`: 프로덕션 서버 실행
*   `npm run lint`: ESLint를 사용한 코드 린팅 (스타일 규칙 검사)
*   `npm run format`: Prettier를 사용한 코드 포맷팅
*   `npm run typecheck`: TypeScript 타입 검사
