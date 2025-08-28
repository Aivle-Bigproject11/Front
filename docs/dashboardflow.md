# Menu2F.js API Request Flow

이 문서는 `Menu2F.js` 컴포넌트의 데이터 요청 및 처리 흐름을 설명합니다. 이 컴포넌트는 AI 기반 사망자 수 예측 대시보드 기능을 담당하며, 여러 API와 상호작용하여 데이터를 시각화합니다.

## 1. 개요

`Menu2F.js`는 페이지가 로드될 때와 사용자가 특정 지역을 선택할 때 백엔드 API에 데이터를 요청합니다. 주요 흐름은 다음과 같습니다.

1.  **초기 데이터 로딩 (`useEffect` on mount)**:
    *   컴포넌트가 처음 렌더링될 때, 2025년과 2026년 1월의 예측 데이터 생성을 백엔드에 요청합니다.
    *   전국 단위의 월별 사망자 수 데이터를 조회하여 '주요지역 현황'을 구성합니다.
    *   '전체' 지역에 대한 상세 데이터를 조회하여 초기 차트와 테이블을 구성합니다.
2.  **지역 선택 (`handleRegionSelect`)**:
    *   사용자가 지도에서 특정 지역을 클릭하면, 해당 지역의 모든 기간(2024, 2025, 2026년) 데이터를 API로 요청합니다.
    *   요청한 데이터를 기반으로 차트와 통계 정보를 업데이트합니다.
3.  **데이터 새로고침 (`handleRefresh`)**:
    *   '데이터 새로고침' 버튼을 클릭하면, 주요 예측 데이터(2024, 2025, 2026년 1월)를 다시 생성하도록 요청하고 현재 선택된 지역의 데이터를 다시 불러옵니다.

## 2. API 엔드포인트 및 서비스

`Menu2F.js`는 `src/services/api.js`에 정의된 `apiService`를 통해 백엔드와 통신합니다.

*   **Base URL**: `http://localhost:8080` (환경 변수 `REACT_APP_API_URL`에 따라 변경 가능)
*   **주요 사용 API 함수**:
    *   `apiService.requestPrediction(data)`: `POST /deathPredictions/request-prediction`
    *   `apiService.getDashboardByDate(date)`: `GET /deathPredictions/by-date/{date}`
    *   `apiService.getDashboardByRegion(region)`: `GET /deathPredictions/by-region/{region}`

## 3. 상세 요청 흐름

### 3.1. 초기 데이터 로딩 (Component Mount)

컴포넌트가 마운트될 때 `useEffect` 훅 내부의 `initializeData` 함수가 실행됩니다.

1.  **URL 파라미터 확인**:
    *   `Menu2N` 페이지에서 전달된 `deploymentData` (인력 배치 데이터)가 있는지 확인하고, 있다면 상태에 저장합니다.

2.  **초기 예측 데이터 생성 요청 (병렬 처리)**:
    *   `Promise.all`을 사용하여 2025년 1월과 2026년 1월의 예측 데이터 생성을 동시에 요청합니다.
    *   **API Call**: `apiService.requestPrediction({ date: "2025-01" })`
        *   **Request**: `POST http://localhost:8080/deathPredictions/request-prediction`
        *   **Body**: `{ "date": "2025-01" }`
    *   **API Call**: `apiService.requestPrediction({ date: "2026-01" })`
        *   **Request**: `POST http://localhost:8080/deathPredictions/request-prediction`
        *   **Body**: `{ "date": "2026-01" }`
    *   *참고: 이 요청은 백엔드가 예측 모델을 실행하도록 트리거하는 역할이며, 예측된 데이터를 직접 반환하지는 않습니다.*

3.  **전국 데이터 조회 (`loadNationalData`)**:
    *   백엔드에서 데이터 처리 시간을 확보하기 위해 2초 대기 후, 현재 월의 전국 데이터를 조회합니다.
    *   **API Call**: `apiService.getDashboardByDate("YYYY-MM")`
        *   **Request**: `GET http://localhost:8080/deathPredictions/by-date/2025-08` (현재 날짜 기준)
        *   **Response**: `nationalData` 상태에 저장됩니다. 이 데이터는 '주요지역 현황' 카드에서 지역별 증가율을 비교하는 데 사용됩니다.

4.  **초기 지역 데이터 로딩 (`loadRegionData('전체')`)**:
    *   '전체' 지역(전국)에 대한 모든 기간의 데이터를 조회합니다.
    *   **API Call**: `apiService.getDashboardByRegion('전국')`
        *   **Request**: `GET http://localhost:8080/deathPredictions/by-region/전국`
        *   **Response**: `currentRegionData` 상태에 저장됩니다.

5.  **차트 데이터 생성 (`generateChartData('전체')`)**:
    *   `loadRegionData` 내부에서 호출됩니다.
    *   `currentRegionData`를 기반으로 2024년(이전), 2025년(예측) 데이터를 분리하여 Chart.js가 요구하는 형식으로 가공합니다.
    *   가공된 데이터는 `chartData` 상태에 저장되어 시계열 차트를 렌더링합니다.

### 3.2. 사용자 지역 선택

사용자가 지도에서 지역을 선택하면 `selectedRegion` 상태가 변경되고, 이를 감지하는 `useEffect` 훅이 `loadRegionData` 함수를 호출합니다.

1.  **특정 지역 데이터 로딩 (`loadRegionData(regionName)`)**:
    *   선택된 지역의 모든 기간 데이터를 조회합니다.
    *   **API Call**: `apiService.getDashboardByRegion(regionName)`
        *   **Request**: `GET http://localhost:8080/deathPredictions/by-region/{regionName}` (예: `GET .../by-region/서울특별시`)
        *   **Response**: `currentRegionData` 상태가 업데이트됩니다.

2.  **차트 데이터 재생성 (`generateChartData(regionName)`)**:
    *   새로 받아온 `currentRegionData`를 기반으로 차트 데이터를 다시 생성하고 `chartData` 상태를 업데이트합니다.

## 4. 데이터 처리 및 상태 관리

*   `isInitialLoading`: 초기 데이터 로딩 중인지 여부를 관리하여 로딩 스피너를 표시합니다.
*   `loading`: 각 지역 데이터를 불러올 때의 로딩 상태를 관리합니다.
*   `error`: API 요청 중 에러 발생 시 에러 메시지를 저장합니다.
*   `nationalData`: 전국 단위의 월별 데이터 (주요지역 현황용).
*   `currentRegionData`: 현재 선택된 지역의 상세 월별 데이터 (테이블 및 통계용).
*   `chartData`: Chart.js에 전달될 포맷으로 가공된 데이터.
*   `deploymentData`: `Menu2N`에서 전달받은 인력 배치 데이터. 이 데이터가 있으면 '주요지역 현황'이 예측 증가율 대신 실제 배치 상태를 기준으로 표시됩니다.
