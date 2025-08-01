import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// Font Awesome 아이콘을 위한 라이브러리 (실제 프로젝트에서는 설치 필요)
// 여기서는 간단한 SVG로 대체합니다.
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg>
);


const Menu5_2 = () => {
  const navigate = useNavigate();
  // 카드 등장 애니메이션을 위한 상태
  const [animateCard, setAnimateCard] = useState(false);

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    occupation: '',
    address: '',
    gender: '남',
    maritalStatus: '미혼',
    hasChildren: '무',
  });
  
  // 질병 목록 상태 관리
  const [diseases, setDiseases] = useState(['질병 01', '질병 02']);
  const [currentDisease, setCurrentDisease] = useState('');

  // 컴포넌트 마운트 시 애니메이션 활성화
  useEffect(() => {
    setAnimateCard(true);
  }, []);

  // 폼 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // 질병 입력 변경 핸들러
  const handleDiseaseChange = (e) => {
    setCurrentDisease(e.target.value);
  };

  // 질병 추가 핸들러
  const handleAddDisease = () => {
    if (currentDisease.trim() !== '' && !diseases.includes(currentDisease.trim())) {
      setDiseases([...diseases, currentDisease.trim()]);
      setCurrentDisease('');
    }
  };

  // 질병 삭제 핸들러
  const handleRemoveDisease = (diseaseToRemove) => {
    setDiseases(diseases.filter(disease => disease !== diseaseToRemove));
  };
  
  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    // 전체 폼 데이터와 질병 목록을 객체로 합침
    const completeFormData = {
      ...formData,
      diseases: diseases
    };
    console.log('제출된 고객 정보:', completeFormData);
    // 여기에 서버로 데이터를 전송하는 로직을 추가할 수 있습니다.
    alert('고객 정보가 추가되었습니다.');
    navigate(-1); // 추가 후 이전 페이지로 이동
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 생년월일 드롭다운 옵션 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      <div className={`form-card-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        height: 'auto',
        margin: '20px auto',
        background: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '20px',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out',
        padding: '30px 40px',
        boxSizing: 'border-box',
      }}>
        <h2 className="form-title">고객 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Column 1 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">이름</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">이메일</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">전화번호</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="숫자 11자리만 입력" maxLength="11" />
              </div>
            </div>

            {/* Column 2 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">생년월일</label>
                <div className="birthdate-selects">
                  <select name="birthYear" value={formData.birthYear} onChange={handleChange} className="form-select">
                    <option value="">년</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} className="form-select">
                    <option value="">월</option>
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                  <select name="birthDay" value={formData.birthDay} onChange={handleChange} className="form-select">
                    <option value="">일</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">직업</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">주소</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" />
              </div>
            </div>

            {/* Column 3 */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">성별</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">결혼여부</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="form-select">
                  <option value="미혼">미혼</option>
                  <option value="기혼">기혼</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">자녀유무</label>
                <select name="hasChildren" value={formData.hasChildren} onChange={handleChange} className="form-select">
                  <option value="무">무</option>
                  <option value="유">유</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">질병</label>
                <div className="disease-input-group">
                  <input 
                    type="text" 
                    value={currentDisease} 
                    onChange={handleDiseaseChange} 
                    className="form-input" 
                    placeholder="여기서 질병 입력하면"
                    onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDisease(); }}}
                  />
                  <button type="button" onClick={handleAddDisease} className="add-btn"><PlusIcon /></button>
                </div>
                <div className="disease-list">
                  {diseases.map((disease, index) => (
                    <div key={index} className="disease-item">
                      <span>{disease}</span>
                      <button type="button" onClick={() => handleRemoveDisease(disease)} className="remove-btn"><XIcon /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="submit-button-container">
            <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
            <button type="submit" className="submit-btn">추가하기</button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #343a40;
          margin-bottom: 30px;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 16px;
          background-color: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        
        .form-input::placeholder {
            color: #adb5bd;
        }

        .birthdate-selects {
          display: flex;
          gap: 10px;
        }
        
        .birthdate-selects > select {
          flex: 1;
        }

        .disease-input-group {
          display: flex;
          gap: 10px;
        }

        .disease-input-group .form-input {
          flex-grow: 1;
        }

        .add-btn {
          flex-shrink: 0;
          width: 45px;
          height: 45px;
          border: 1px solid #ced4da;
          background-color: #f8f9fa;
          color: #495057;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .add-btn:hover {
          background-color: #e9ecef;
          border-color: #adb5bd;
        }

        .disease-list {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 150px;
          overflow-y: auto;
          padding-right: 5px;
        }
        
        /* Custom Scrollbar for disease list */
        .disease-list::-webkit-scrollbar {
          width: 5px;
        }
        .disease-list::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .disease-list::-webkit-scrollbar-thumb {
          background-color: rgba(108, 117, 125, 0.5);
          border-radius: 10px;
        }

        .disease-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #e9ecef;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
        }

        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
          padding: 0;
          line-height: 1;
        }
        
        .remove-btn:hover {
            color: #dc3545;
        }

        .submit-button-container {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .submit-btn, .cancel-btn {
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn {
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #673f91 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transform: translateY(-2px);
        }
        
        .cancel-btn {
          color: white;
          background-color: #6c757d;
        }

        .cancel-btn:hover {
          background-color: #5a6268;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .form-card-container {
            padding: 20px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
           .submit-button-container {
            justify-content: center;
          }
          .submit-btn, .cancel-btn {
            width: 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu5_2;
