import React, { useState, useEffect } from 'react';
import './Menu3.css'; 

const Menu3 = () => {
  // 검색 필터 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('전체');
  const [genderFilter, setGenderFilter] = useState({ male: false, female: false });
  const [diseaseFilter, setDiseaseFilter] = useState({ none: false, has: false });
  const [marriageFilter, setMarriageFilter] = useState('전체');
  const [childrenFilter, setChildrenFilter] = useState('전체');
  const [paymentFilter, setPaymentFilter] = useState('전체');

  // 고객 데이터 (더미 데이터)
  const [customers, setCustomers] = useState([
    { id: 'SB2001', name: '김강봉', age: 60, gender: '남', subscriptionPeriod: '2020.01.03.~2025.07.18', familyComposition: '자녀 2' },
    { id: 'SB2002', name: '김선우', age: 35, gender: '남', subscriptionPeriod: '2020.01.05.~2025.07.18', familyComposition: '기혼' },
    { id: 'SB2003', name: '이예주', age: 30, gender: '여', subscriptionPeriod: '2020.01.24.~2025.07.18', familyComposition: '미혼' },
    { id: 'SB2004', name: '김순자', age: 70, gender: '여', subscriptionPeriod: '2020.03.01.~2025.07.18', familyComposition: '자녀 4' },
    { id: 'SB2005', name: '최현숙', age: 65, gender: '남', subscriptionPeriod: '2020.08.08.~2025.07.18', familyComposition: '자녀 1' },
    { id: 'SB2006', name: '이영수', age: 55, gender: '남', subscriptionPeriod: '2020.10.09.~2025.07.18', familyComposition: '기혼, 자녀 X' },
  ]);

  // 필터링된 고객 데이터
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  // 선택된 고객 (체크박스)
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  // 고객 상세 정보 및 메시지 발송 기록
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  // 메시지 미리보기 내용
  const [messagePreview, setMessagePreview] = useState('');
  // 삭제 팝업 상태
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  // 전송 완료 팝업 상태
  const [showTransmissionCompletePopup, setShowTransmissionCompletePopup] = useState(false);

  // 컴포넌트 마운트 시 초기 필터링 적용 (모든 고객 표시)
  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  // 검색 필터링 로직
  const handleSearch = () => {
    let tempCustomers = [...customers];

    // 고객명 또는 고객 고유번호 검색
    if (searchTerm) {
      tempCustomers = tempCustomers.filter(customer =>
        customer.name.includes(searchTerm) || customer.id.includes(searchTerm)
      );
    }

    // 나이 필터링
    if (ageFilter !== '전체') {
      tempCustomers = tempCustomers.filter(customer => {
        const age = customer.age;
        if (ageFilter === '20대') return age >= 20 && age < 30;
        if (ageFilter === '30대') return age >= 30 && age < 40;
        if (ageFilter === '40대') return age >= 40 && age < 50;
        if (ageFilter === '50대') return age >= 50 && age < 60;
        if (ageFilter === '60대 이상') return age >= 60;
        return true;
      });
    }

    // 성별 필터링
    if (genderFilter.male && !genderFilter.female) {
      tempCustomers = tempCustomers.filter(customer => customer.gender === '남');
    } else if (!genderFilter.male && genderFilter.female) {
      tempCustomers = tempCustomers.filter(customer => customer.gender === '여');
    }

    // 질병 필터링 (더미 데이터에는 질병 정보가 없으므로 임시로 구현)
    // 실제 데이터가 들어오면 customer.disease 등으로 필터링 로직 추가 필요
    // if (diseaseFilter.none && !diseaseFilter.has) {
    //   tempCustomers = tempCustomers.filter(customer => customer.disease === '없음');
    // } else if (!diseaseFilter.none && diseaseFilter.has) {
    //   tempCustomers = tempCustomers.filter(customer => customer.disease === '있음');
    // }

    // 결혼 필터링
    if (marriageFilter !== '전체') {
      tempCustomers = tempCustomers.filter(customer => customer.familyComposition.includes(marriageFilter));
    }

    // 자녀 필터링
    if (childrenFilter !== '전체') {
      // '유' 또는 '무' 필터링 로직
      if (childrenFilter === '유') {
        tempCustomers = tempCustomers.filter(customer => customer.familyComposition.includes('자녀') && !customer.familyComposition.includes('자녀 X'));
      } else if (childrenFilter === '무') {
        tempCustomers = tempCustomers.filter(customer => customer.familyComposition.includes('자녀 X'));
      }
    }

    // 납입금 필터링 (더미 데이터에는 납입금 정보가 없으므로 임시로 구현)
    // 실제 데이터가 들어오면 customer.payment 등으로 필터링 로직 추가 필요
    // if (paymentFilter !== '전체') {
    //   const [min, max] = paymentFilter.split('~').map(s => parseInt(s));
    //   tempCustomers = tempCustomers.filter(customer => customer.payment >= min && customer.payment <= max);
    // }

    setFilteredCustomers(tempCustomers);
    setSelectedCustomers([]); // 필터링 시 선택된 고객 초기화
  };

  // 체크박스 핸들러
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers(prevSelected => {
      if (prevSelected.includes(customerId)) {
        return prevSelected.filter(id => id !== customerId);
      } else {
        return [...prevSelected, customerId];
      }
    });
  };

  // 메시지 생성 버튼 클릭 (AI API 연동 필요)
  const handleGenerateMessage = async () => {
    if (selectedCustomers.length === 0) {
      alert('메시지를 생성할 고객을 선택해주세요.'); // 실제로는 커스텀 모달 사용
      return;
    }

    // AI API 호출 (더미 데이터 사용)
    const prompt = `다음 고객들에게 전환 서비스 추천 메시지를 생성해줘: ${selectedCustomers.map(id => customers.find(c => c.id === id).name).join(', ')}`;
    console.log('AI API 호출 프롬프트:', prompt);

    // AI API 응답을 기다리는 동안 로딩 표시
    setMessagePreview('메시지 생성 중...');

    try {
        // AI API 호출 예시 (실제 API 연동 시 주석 해제 및 수정 필요)
        // const payload = { contents: [{ parts: [{ text: prompt }] }] };
        // const apiKey = ""; // API 키는 Canvas 런타임에서 제공
        // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        // const response = await fetch(apiUrl, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        // });
        // const result = await response.json();
        // const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        // 더미 메시지 생성
        const generatedText = `[추천 전환 서비스 메시지]\n\n${selectedCustomers.map(id => customers.find(c => c.id === id).name).join(', ')} 고객님, 안녕하세요! 고객님의 현재 서비스 이용 패턴을 분석한 결과, 더욱 만족스러운 경험을 위한 특별한 전환 서비스를 추천드립니다. 자세한 내용은 아래 링크를 통해 확인해주세요!\n\n[링크 이동하기]`;
        setMessagePreview(generatedText);
    } catch (error) {
        console.error('메시지 생성 중 오류 발생:', error);
        setMessagePreview('메시지 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 메시지 수정 버튼 클릭 (메시지 미리보기 직접 수정 가능)
  const handleEditMessage = () => {
    const textarea = document.getElementById('message-preview-textarea');
    if (textarea) {
      textarea.readOnly = !textarea.readOnly;
      textarea.focus(); // 편집 모드 진입 시 포커스
    }
  };

  // 메시지 전송 버튼 클릭 (팝업 표시)
  const handleSendMessage = () => {
    if (selectedCustomers.length === 0) {
      alert('메시지를 전송할 고객을 선택해주세요.'); // 실제로는 커스텀 모달 사용
      return;
    }
    if (!messagePreview) {
      alert('생성된 메시지가 없습니다.'); // 실제로는 커스텀 모달 사용
      return;
    }
    setShowTransmissionCompletePopup(true);
    // 실제 전송 로직 추가 (백엔드 연동)
    console.log('메시지 전송:', messagePreview, '대상 고객:', selectedCustomers);
  };

  // 고객명 클릭 시 상세 정보 표시
  const handleCustomerNameClick = (customer) => {
    setSelectedCustomerDetail(customer);
  };

  return (
    <div className="menu3-container">
      <div className="content-area">
        <h2 className="page-title" style={{ textAlign: 'left' }}>메시지 관리</h2>

        {/* 필터링 부분 */}
        <div className="filter-section">
          <div className="filter-row-all">
            <div className="filter-item search-input-group">
              <label htmlFor="customer-search">고객명 또는 고객 고유번호</label> 
              <div className="search-input-wrapper">
                <input
                  type="text"
                  id="customer-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="고객명 또는 고객 고유번호 입력" 
                />
              </div>
            </div>

            <div className="filter-item">
              <label htmlFor="age-select">나이</label>
              <select id="age-select" value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                <option value="전체">전체</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대">50대</option>
                <option value="60대 이상">60대 이상</option>
              </select>
            </div>

            <div className="filter-item checkbox-group">
              <label>성별</label>
              <input
                type="checkbox"
                id="gender-male"
                checked={genderFilter.male}
                onChange={(e) => setGenderFilter({ ...genderFilter, male: e.target.checked })}
              />
              <label htmlFor="gender-male">남</label>
              <input
                type="checkbox"
                id="gender-female"
                checked={genderFilter.female}
                onChange={(e) => setGenderFilter({ ...genderFilter, female: e.target.checked })}
              />
              <label htmlFor="gender-female">여</label>
            </div>

            <div className="filter-item checkbox-group">
              <label>질병</label>
              <input
                type="checkbox"
                id="disease-none"
                checked={diseaseFilter.none}
                onChange={(e) => setDiseaseFilter({ ...diseaseFilter, none: e.target.checked })}
              />
              <label htmlFor="disease-none">무</label>
              <input
                type="checkbox"
                id="disease-has"
                checked={diseaseFilter.has}
                onChange={(e) => setDiseaseFilter({ ...diseaseFilter, has: e.target.checked })}
              />
              <label htmlFor="disease-has">유</label>
            </div>

            <div className="filter-item filter-item-small-select">
              <label htmlFor="marriage-select">결혼</label>
              <select id="marriage-select" value={marriageFilter} onChange={(e) => setMarriageFilter(e.target.value)}>
                <option value="전체">전체</option>
                <option value="기혼">기혼</option>
                <option value="미혼">미혼</option>
              </select>
            </div>

            <div className="filter-item filter-item-small-select">
              <label htmlFor="children-select">자녀</label>
              <select id="children-select" value={childrenFilter} onChange={(e) => setChildrenFilter(e.target.value)}>
                <option value="전체">전체</option>
                <option value="유">유</option>
                <option value="무">무</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="payment-select">납입금</label>
              <select id="payment-select" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                <option value="전체">전체</option>
                <option value="400~499">400~499 만원</option>
                <option value="500~599">500~599 만원</option>
                <option value="600 이상">600만원 이상</option>
              </select>
            </div>
          </div>

          <div className="filter-row-bottom">
            <button className="search-button" onClick={handleSearch}>조회</button>
          </div>
        </div>

        {/* 고객 정보 표 */}
        <div className="customer-table-section">
          <h3 style={{ textAlign: 'left' }}>고객 정보</h3>
          <table>
            <thead>
              <tr>
                <th></th> {/* 체크박스 컬럼 */}
                <th>고객 고유번호</th>
                <th>이름</th>
                <th>나이</th>
                <th>성별</th>
                <th>납입기간</th>
                <th>가족 구성원</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerSelect(customer.id)}
                    />
                  </td>
                  <td>{customer.id}</td>
                  <td className="customer-name-cell" onClick={() => handleCustomerNameClick(customer)}>{customer.name}</td>
                  <td>{customer.age}</td>
                  <td>{customer.gender}</td>
                  <td>{customer.subscriptionPeriod}</td>
                  <td>{customer.familyComposition}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-buttons">
            <button className="button-primary" onClick={handleGenerateMessage}>메시지 생성</button>
          </div>
        </div>

        {/* 메시지 미리보기 및 고객 정보/발송 기록 섹션 */}
        <div className="bottom-section">
          {/* 메시지 미리보기 */}
          <div className="message-preview-section">
            <h3>메시지 미리보기</h3>
            <div className="message-content-box">
              <textarea
                id="message-preview-textarea"
                className="message-textarea"
                value={messagePreview}
                onChange={(e) => setMessagePreview(e.target.value)}
                readOnly={true} // 초기에는 읽기 전용
              ></textarea>
            </div>
            <div className="message-actions">
              <button className="button-primary" onClick={handleEditMessage}>메시지 수정</button>
              <button className="button-primary" onClick={handleSendMessage}>메시지 전송</button>
            </div>
          </div>

          {/* 고객 정보 및 메시지 발송 기록 */}
          <div className="customer-detail-section">
            <h3>고객 정보 및 메시지 발송 기록</h3>
            {selectedCustomerDetail ? (
              <div className="customer-detail-content">
                <div className="customer-info-box">
                  <h4>고객 상세 정보</h4>
                  <p><strong>이름:</strong> {selectedCustomerDetail.name}</p>
                  <p><strong>나이:</strong> {selectedCustomerDetail.age}</p>
                  <p><strong>직업:</strong> 없음 (더미)</p>
                  <p><strong>채널:</strong> 없음 (더미)</p>
                  <p><strong>납입 기간:</strong> 2년 6개월 (더미)</p>
                  <p><strong>가족 구성원:</strong> {selectedCustomerDetail.familyComposition}</p>
                </div>
                <div className="message-history-box">
                  <h4>메시지 발송 기록</h4>
                  {/* 실제 발송 기록 데이터가 들어올 부분 */}
                  <p className="no-history">발송 기록이 없습니다.</p>
                  {/* 예시 발송 기록 (이미지 포함) */}
                  <div className="sample-message-record">
                    <p><strong>발송 일시:</strong> 2025.07.20</p>
                    <div className="message-card">
                      <img src="https://placehold.co/100x70/E0E0E0/333333?text=Image1" alt="Sample Image 1" className="message-image" />
                      <img src="https://placehold.co/100x70/E0E0E0/333333?text=Image2" alt="Sample Image 2" className="message-image" />
                      <p className="message-text">
                        OOO상품 OO님, 요즘 자녀가 결혼할 시기시죠?<br/>
                        아니면 곧 퇴직 후 여행 생각 없으신가요? OO상품으로 맞춤 패키지를 추천드립니다!
                        <a href="#" className="detail-link">자세히 보기</a>
                      </p>
                    </div>
                    <button className="button-resend">재전송</button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-selection-message">고객을 선택하여 상세 정보를 확인하세요.</p>
            )}
          </div>
        </div>
      </div>

      {/* 전송 완료 팝업 */}
      {showTransmissionCompletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>메시지 전송이 완료되었습니다.</p>
            <div className="popup-buttons">
              <button className="button-primary" onClick={() => setShowTransmissionCompletePopup(false)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu3;
