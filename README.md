# Movie Recommendation Service 🎬

영화 추천 및 관리 플랫폼 (React Frontend)

---

## 📌 프로젝트 개요
- **목적**: 사용자 맞춤형 영화 추천 및 관리 시스템 제공
- **주요 기능**: 소셜 로그인, 개인화 추천, 영화 검색, 관리자 대시보드
- **대상 사용자**: 영화 애호가 및 콘텐츠 관리자

---

## ✨ 주요 기능

### 🔐 인증 시스템
- 카카오/구글 소셜 로그인 연동
- 관리자 전용 ID/PW 로그인
- 최초 로그인 시 장르 선호도 선택 페이지 자동 리다이렉트

### 🎥 메인 페이지
- 실시간 맞춤 추천 알고리즘
  - 사용자 선호 장르 기반
  - 시청 기록 분석
  - 실시간 인기 영화 차트
- 24시간 주기 콘텐츠 갱신
- 관리자가 등록한 개봉 예정작 표출

### 🔍 검색 시스템
- 다중 필터 지원
  - 영화 제목/장르/배우 검색
  - 사용자 선호도 가중치 적용
- 실시간 검색어 추천

### 📄 영화 상세 정보
- 포스터 이미지 다운로드 기능
- 영화 메타데이터 표시
  - 평점/러닝타임/줄거리
  - 출연진 정보

### 🤖 AI 챗봇
- 영화 Q&A 자연어 처리
- 추천 문의 대응
- 영화 정보 안내

### 👤 사용자 관리
- 프로필 수정 기능
  - 닉네임 변경
  - 선호 장르 재설정
- 회원 탈퇴 기능

### 🛠 관리자 전용
- 영화 데이터 CRUD 관리
- 포스터 이미지 업로드 시스템
- 개봉 예정작 등록/수정

---

## 🛠 기술 스택

### Frontend
| 분류       | 기술                   |
|------------|------------------------|
| Framework  | React 18               |
| Routing    | react-router-dom 6     |
| UI Library | Material-UI (MUI)      |
| HTTP Client| axios                 |
| State      | Context API            |
| Social Login | react-kakao-login, @react-oauth/google |

---

## 🚀 설치 및 실행

```bash
# 1. 저장소 복제
git clone https://github.com/your-organization/movie-recommendation-frontend.git

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정 (.env 파일 생성)
REACT_APP_KAKAO_CLIENT_ID=your_kakao_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_key
REACT_APP_API_BASE_URL=http://api.yourserver.com

# 4. 개발 서버 실행
npm run dev