// api.js에서 기본 axios 설정 가져옴
import api from './api';

export const recommendationService = {
  // 1. 전체 고객 목록 조회
  getAllCustomers: () => api.get('/customer-infos'),

  // 2. 메시지 미리보기 생성 
  generatePreviewMessage: (data) => api.post('/recommendMessages/preview-message', data),

  // 3. 특정 고객(개인)에게 생성된 메시지 전송 ->아마 사용 x:4번만으로 가능
  //sendPreviewMessageToCustomer: (data) => api.post('/recommendMessages/save-preview', data),

  // 4. 필터링된 그룹에게 생성된 메시지 전송
  sendGroupMessage: (data) => api.post('/recommendMessages/generate-group-message', data),

  // 5. 전송된 모든 추천 메시지 확인
  getAllSentMessages: () => api.get('/recommendMessages'),

  // 6. 특정 고객에게 보낸 추천 메시지 확인 (발송 기록)
  getCustomerHistory: (customerId) => api.get(`/recommendMessages/customer/${customerId}`),

  // 7. 특정 고객에게 보낸 가장 최신의 추천 메시지 확인
  getLatestCustomerHistory: (customerId) => api.get(`/recommendMessages/customer/${customerId}/latest`),

  // 8. 필터링된 고객들 목록 보기 
  getFilteredCustomers: (filters) => api.get('/customer-infos/filter', { params: filters }),
};