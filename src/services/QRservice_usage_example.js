// QRService 사용 예시

// 1. 파일 상단에 import 추가
import QRService from '../services/QRservice';

// 2. 컴포넌트 내부에서 사용하는 예시

// QR코드 생성 및 다운로드 함수
const handleGenerateQRCode = async (memorialId, memorialName = '') => {
  try {
    // 로딩 상태 설정 (필요한 경우)
    // setLoading(true);
    
    // QR코드 생성 및 다운로드
    await QRService.generateAndDownloadMemorialQRCode(
      memorialId,
      memorialName,
      {
        width: 300,  // QR코드 크기
        margin: 2,   // 여백
        color: {
          dark: '#000000',  // QR코드 색상
          light: '#FFFFFF'  // 배경 색상
        }
      }
    );
    
    // 성공 메시지 표시 (필요한 경우)
    console.log('QR코드가 다운로드되었습니다.');
    
  } catch (error) {
    console.error('QR코드 생성 실패:', error);
    // 에러 메시지 표시 (필요한 경우)
    alert('QR코드 생성에 실패했습니다.');
  } finally {
    // setLoading(false);
  }
};

// QR코드 미리보기 모달을 위한 함수
const handleShowQRPreview = async (memorialId) => {
  try {
    const qrCodeDataUrl = await QRService.generateMemorialQRCode(memorialId);
    // 모달에 QR코드 이미지 표시
    setPreviewContent({
      title: '추모관 QR코드',
      content: `<img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 100%; height: auto;" />`
    });
    setShowPreviewModal(true);
  } catch (error) {
    console.error('QR코드 미리보기 실패:', error);
  }
};

// JSX에서 버튼 사용 예시
{/* QR코드 생성 버튼 */}
<Button
  variant="outline-primary"
  size="sm"
  onClick={() => handleGenerateQRCode(memorial.id, memorial.deceasedName)}
  className="me-2"
>
  <i className="fas fa-qrcode me-1"></i>
  QR코드 다운로드
</Button>

{/* QR코드 미리보기 버튼 */}
<Button
  variant="outline-secondary"
  size="sm"
  onClick={() => handleShowQRPreview(memorial.id)}
>
  <i className="fas fa-eye me-1"></i>
  QR코드 미리보기
</Button>

// Canvas를 사용한 QR코드 렌더링 예시
const QRCodeCanvas = ({ memorialId }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current && memorialId) {
      QRService.renderMemorialQRCodeToCanvas(
        canvasRef.current,
        memorialId,
        {
          width: 200,
          margin: 2
        }
      ).catch(error => {
        console.error('Canvas QR코드 렌더링 실패:', error);
      });
    }
  }, [memorialId]);
  
  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      style={{ border: '1px solid #ddd', borderRadius: '8px' }}
    />
  );
};

// 사용법:
// <QRCodeCanvas memorialId={memorial.id} />
