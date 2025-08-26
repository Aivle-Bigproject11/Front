import QRCode from 'qrcode';

/**
 * QR코드 생성 및 다운로드 서비스
 */
class QRService {
  /**
   * 추모관 게스트 페이지 URL을 생성합니다
   * @param {string} memorialId - 추모관 ID
   * @param {string} baseUrl - 기본 URL (기본값: http://localhost:3000)
   * @returns {string} 생성된 URL
   */
  static generateMemorialGuestUrl(memorialId, baseUrl = window.location.origin) {
    return `${baseUrl}/memorial/${memorialId}/guest`;
  }

  /**
   * QR코드를 생성합니다
   * @param {string} text - QR코드에 포함할 텍스트/URL
   * @param {Object} options - QR코드 생성 옵션
   * @returns {Promise<string>} Base64 인코딩된 QR코드 이미지 데이터 URL
   */
  static async generateQRCode(text, options = {}) {
    try {
      const defaultOptions = {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M',
        type: 'image/png'
      };

      const qrOptions = { ...defaultOptions, ...options };
      const qrCodeDataUrl = await QRCode.toDataURL(text, qrOptions);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('QR코드 생성 중 오류 발생:', error);
      throw new Error('QR코드 생성에 실패했습니다.');
    }
  }

  /**
   * 추모관 QR코드를 생성합니다
   * @param {string} memorialId - 추모관 ID
   * @param {Object} options - QR코드 생성 옵션
   * @param {string} baseUrl - 기본 URL
   * @returns {Promise<string>} Base64 인코딩된 QR코드 이미지 데이터 URL
   */
  static async generateMemorialQRCode(memorialId, options = {}, baseUrl = window.location.origin) {
    const url = this.generateMemorialGuestUrl(memorialId, baseUrl);
    return await this.generateQRCode(url, options);
  }

  /**
   * QR코드 이미지를 다운로드합니다
   * @param {string} dataUrl - Base64 인코딩된 이미지 데이터 URL
   * @param {string} filename - 다운로드할 파일명 (기본값: qrcode.png)
   */
  static downloadQRCode(dataUrl, filename = 'qrcode.png') {
    try {
      // a 태그를 생성하여 다운로드 실행
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('QR코드 다운로드 중 오류 발생:', error);
      throw new Error('QR코드 다운로드에 실패했습니다.');
    }
  }

  /**
   * 추모관 QR코드를 생성하고 다운로드합니다
   * @param {string} memorialId - 추모관 ID
   * @param {string} memorialName - 추모관 이름 (파일명에 사용, 선택사항)
   * @param {Object} options - QR코드 생성 옵션
   * @param {string} baseUrl - 기본 URL
   */
  static async generateAndDownloadMemorialQRCode(
    memorialId, 
    memorialName = '', 
    options = {}, 
    baseUrl = window.location.origin
  ) {
    try {
      // QR코드 생성
      const qrCodeDataUrl = await this.generateMemorialQRCode(memorialId, options, baseUrl);
      
      // 파일명 생성
      const sanitizedName = memorialName 
        ? memorialName.replace(/[^a-zA-Z0-9가-힣]/g, '_') 
        : memorialId.substring(0, 8);
      const filename = `추모관_QR_${sanitizedName}.png`;
      
      // 다운로드 실행
      this.downloadQRCode(qrCodeDataUrl, filename);
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('추모관 QR코드 생성 및 다운로드 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * QR코드를 Canvas에 그립니다
   * @param {HTMLCanvasElement} canvas - 대상 캔버스 엘리먼트
   * @param {string} text - QR코드에 포함할 텍스트/URL
   * @param {Object} options - QR코드 생성 옵션
   */
  static async renderQRCodeToCanvas(canvas, text, options = {}) {
    try {
      const defaultOptions = {
        width: canvas.width || 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      };

      const qrOptions = { ...defaultOptions, ...options };
      await QRCode.toCanvas(canvas, text, qrOptions);
    } catch (error) {
      console.error('Canvas에 QR코드 렌더링 중 오류 발생:', error);
      throw new Error('QR코드 렌더링에 실패했습니다.');
    }
  }

  /**
   * 추모관 QR코드를 Canvas에 그립니다
   * @param {HTMLCanvasElement} canvas - 대상 캔버스 엘리먼트
   * @param {string} memorialId - 추모관 ID
   * @param {Object} options - QR코드 생성 옵션
   * @param {string} baseUrl - 기본 URL
   */
  static async renderMemorialQRCodeToCanvas(canvas, memorialId, options = {}, baseUrl = window.location.origin) {
    const url = this.generateMemorialGuestUrl(memorialId, baseUrl);
    await this.renderQRCodeToCanvas(canvas, url, options);
  }
}

export default QRService;
