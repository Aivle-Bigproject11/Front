// src/services/customerService.js
import api from './api'; 

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8088';

// Mock 데이터
export const mockCustomers = [
  {
    id: 1,
    name: '양성현',
    phone: '010-1234-5678',
    type: '고인',
    status: 'pending',
    age: '75',
    documents: {
      obituary: false,
      schedule: false,
      deathCertificate: false
    },
    funeralDate: '2025-08-02',
    location: '서울시 강남구 삼성동',
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-01T10:00:00Z'
  },
  {
    id: 2,
    name: '김시훈',
    phone: '010-2345-6789',
    type: '고인',
    status: 'inProgress',
    age: '96',
    documents: {
      obituary: true,
      schedule: false,
      deathCertificate: false
    },
    funeralDate: '2025-08-01',
    location: '부산시 해운대구',
    createdAt: '2025-07-31T14:30:00Z',
    updatedAt: '2025-08-01T09:15:00Z'
  },
  {
    id: 3,
    name: '박수연',
    phone: '010-3456-7890',
    type: '고인',
    status: 'completed',
    age: '88',
    documents: {
      obituary: true,
      schedule: true,
      deathCertificate: true
    },
    funeralDate: '2025-07-30',
    location: '대구시 중구',
    createdAt: '2025-07-28T16:45:00Z',
    updatedAt: '2025-07-30T11:20:00Z'
  },
  {
    id: 4,
    name: '류근우',
    phone: '010-4567-8901',
    type: '고인',
    status: 'pending',
    age: '94',
    documents: {
      obituary: false,
      schedule: true,
      deathCertificate: false
    },
    funeralDate: '2025-08-03',
    location: '인천시 남동구',
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2025-08-01T08:00:00Z'
  }
];

// API 호출 함수들
export const customerService = {
  // 1. 모든 고객 조회 
  getAllCustomers: () => api.get('/customerProfiles'),

  // 2. 특정 고객 조회 
  getCustomerById: (id) => api.get(`/customerProfiles/${id}`),

  // 3. 고객 추가 
  createCustomer: (customerData) => api.post('/customerProfiles', customerData),

  // 4. 고객 정보 수정
  updateCustomer: (id, customerData) => api.patch(`/customerProfiles/${id}`, customerData),

  // 5. 고객 삭제 
  deleteCustomer: (id) => api.delete(`/customerProfiles/${id}`),

  // 서류 상태 업데이트
  updateDocumentStatus: async (customerId, docType, isCompleted) => {
    try {
      // const response = await fetch(`${API_BASE_URL}/customers/${customerId}/documents`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ docType, isCompleted }),
      // });
      // if (!response.ok) throw new Error('Failed to update document status');
      // return await response.json();
      
      // Mock 데이터 반환 (개발용)
      return new Promise(resolve => {
        setTimeout(() => {
          const customer = mockCustomers.find(c => c.id === parseInt(customerId));
          if (customer) {
            customer.documents[docType] = isCompleted;
            customer.updatedAt = new Date().toISOString();
            
            // 상태 자동 업데이트
            const allCompleted = Object.values(customer.documents).every(status => status);
            const someCompleted = Object.values(customer.documents).some(status => status);
            
            if (allCompleted) {
              customer.status = 'completed';
            } else if (someCompleted) {
              customer.status = 'inProgress';
            } else {
              customer.status = 'pending';
            }
            
            resolve(customer);
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      throw error;
    }
  }
};

// 유틸리티 함수들
export const customerUtils = {
  getStatusColor: (status) => {
    switch(status) {
      case 'pending': return 'bg-warning text-dark';
      case 'inProgress': return 'bg-info text-white';
      case 'completed': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  },

  getStatusText: (status) => {
    switch(status) {
      case 'pending': return '대기중';
      case 'inProgress': return '진행중';
      case 'completed': return '완료';
      default: return '알수없음';
    }
  },

  getUrgencyLevel: (funeralDate) => {
    const today = new Date();
    const funeral = new Date(funeralDate);
    const diffTime = funeral.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 2) return 'warning';
    return 'normal';
  },

  getUrgencyBorder: (level) => {
    switch(level) {
      case 'urgent': return '3px solid #dc3545';
      case 'warning': return '3px solid #ffc107';
      default: return '3px solid #6f42c1';
    }
  },

  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};
