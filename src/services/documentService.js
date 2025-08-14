// src/services/documentService.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8088';

// 서류 템플릿 데이터
export const documentTemplates = {
  obituary: {
    title: '부고장',
    template: `
고 {고인성명한글} 별세

향년 {고인나이}세

발인일시: {발인일시}
장례식장: {장례식장이름}
빈소: {빈소정보}
장지: {장지정보}

상주: {상주목록}

삼가 고인의 명복을 빕니다.
    `,
    requiredFields: ['고인성명한글', '고인나이', '발인일시', '장례식장이름']
  },
  deathCertificate: {
    title: '사망신고서',
    template: `
사망신고서

성명: {고인성명한글} ({고인성명한자})
주민등록번호: {고인주민등록번호}
나이: {고인나이}세
성별: {고인성별}
사망일: {고인돌아가신날짜}
종교: {고인종교}

신고인: {신고인이름}
신고인 주민등록번호: {신고인주민등록번호}
신고인 연락처: {신고인전화번호}
신고인과 고인의 관계: {신고인과고인의관계}
신고인 주소: {신고인주소}

위와 같이 사망신고를 합니다.

제출인: {제출인이름}
제출인 주민등록번호: {제출인주민등록번호}
    `,
    requiredFields: ['고인성명한글', '고인주민등록번호', '고인나이', '고인돌아가신날짜', '신고인이름', '신고인주민등록번호']
  },
  schedule: {
    title: '장례일정표',
    template: `
장례일정표

고인: {고인성명한글}
향년: {고인나이}세

장례식장: {장례식장이름}
주소: {장례식장주소}
빈소: {빈소정보}

입관: {고인돌아가신날짜} 오전 10시
발인: {발인일시}
장지: {장지정보}

담당 장례지도사: {담당장례지도사이름}
연락처: {담당장례지도사연락처}

상주: {상주목록}

※ 세부 일정은 상황에 따라 변경될 수 있습니다.
    `,
    requiredFields: ['고인성명한글', '고인나이', '장례식장이름', '발인일시', '담당장례지도사이름']
  }
};

export const documentService = {
  // 서류 생성
  generateDocument: async (customerId, docType, formData) => {
    try {
      // const response = await fetch(`${API_BASE_URL}/documents/generate`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ customerId, docType, formData }),
      // });
      // if (!response.ok) throw new Error('Failed to generate document');
      // return await response.json();
      
      // Mock 서류 생성 (개발용)
      return new Promise(resolve => {
        setTimeout(() => {
          const template = documentTemplates[docType];
          if (!template) {
            throw new Error(`Unknown document type: ${docType}`);
          }
          
          let content = template.template;
          
          // 템플릿에 데이터 삽입
          Object.entries(formData).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            content = content.replace(new RegExp(placeholder, 'g'), value || '[미입력]');
          });
          
          const document = {
            id: Date.now(),
            customerId,
            docType,
            title: template.title,
            content,
            createdAt: new Date().toISOString(),
            status: 'generated'
          };
          
          resolve(document);
        }, 800);
      });
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  },

  // 서류 미리보기
  previewDocument: async (docType, formData) => {
    try {
      const template = documentTemplates[docType];
      if (!template) {
        throw new Error(`Unknown document type: ${docType}`);
      }
      
      let content = template.template;
      
      // 템플릿에 데이터 삽입
      Object.entries(formData).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        content = content.replace(new RegExp(placeholder, 'g'), value || '[미입력]');
      });
      
      return {
        title: template.title,
        content,
        requiredFields: template.requiredFields
      };
    } catch (error) {
      console.error('Error previewing document:', error);
      throw error;
    }
  },

  // 서류 다운로드
  downloadDocument: async (documentId) => {
    try {
      // const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`);
      // if (!response.ok) throw new Error('Failed to download document');
      // return await response.blob();
      
      // Mock 다운로드 (개발용)
      return new Promise(resolve => {
        setTimeout(() => {
          const blob = new Blob(['Mock document content'], { type: 'text/plain' });
          resolve(blob);
        }, 500);
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },

  // 서류 인쇄
  printDocument: async (documentId) => {
    try {
      // 실제로는 서버에서 PDF 생성 후 인쇄 대화상자 열기
      // const response = await fetch(`${API_BASE_URL}/documents/${documentId}/print`);
      // if (!response.ok) throw new Error('Failed to print document');
      
      // Mock 인쇄 (개발용)
      return new Promise(resolve => {
        setTimeout(() => {
          window.print();
          resolve({ success: true });
        }, 300);
      });
    } catch (error) {
      console.error('Error printing document:', error);
      throw error;
    }
  },

  // 고객의 모든 서류 조회
  getCustomerDocuments: async (customerId) => {
    try {
      // const response = await fetch(`${API_BASE_URL}/customers/${customerId}/documents`);
      // if (!response.ok) throw new Error('Failed to fetch documents');
      // return await response.json();
      
      // Mock 데이터 반환 (개발용)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              customerId,
              docType: 'obituary',
              title: '부고장',
              status: 'generated',
              createdAt: '2025-08-01T10:00:00Z'
            },
            {
              id: 2,
              customerId,
              docType: 'schedule',
              title: '장례일정표',
              status: 'generated',
              createdAt: '2025-08-01T10:30:00Z'
            }
          ]);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching customer documents:', error);
      throw error;
    }
  }
};

// 서류 유틸리티 함수들
export const documentUtils = {
  // 서류 이름 매핑
  getDocumentName: (docType) => {
    const names = {
      obituary: '부고장',
      schedule: '장례일정표',
      deathCertificate: '사망신고서'
    };
    return names[docType] || docType;
  },

  // 필수 필드 확인
  validateRequiredFields: (docType, formData) => {
    const template = documentTemplates[docType];
    if (!template) return { isValid: false, missingFields: [] };
    
    const missingFields = template.requiredFields.filter(field => !formData[field]);
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  },

  // 서류 상태 아이콘
  getStatusIcon: (status) => {
    const icons = {
      pending: '⏳',
      generated: '✅',
      printed: '🖨️',
      downloaded: '📥'
    };
    return icons[status] || '❓';
  },

  // 서류 상태 텍스트
  getStatusText: (status) => {
    const texts = {
      pending: '대기중',
      generated: '생성완료',
      printed: '인쇄완료',
      downloaded: '다운로드완료'
    };
    return texts[status] || '알수없음';
  }
};
