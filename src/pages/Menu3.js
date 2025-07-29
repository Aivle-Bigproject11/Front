
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Modal } from 'react-bootstrap';

import React, { useState, useEffect, useCallback } from 'react';

// Lucide React 아이콘 (돋보기, 체크, 전송 등)
// Lucide React는 SVG를 직접 삽입하는 방식이므로 CSS 의존성이 적어 계속 사용합니다.
import { Search, CheckCircle, Send, Edit, MessageSquare, History, User, Calendar, DollarSign, Heart, Family, Briefcase, X, AlertCircle, RefreshCcw } from 'lucide-react';

// 백엔드 API 기본 URL 설정 (현재는 사용하지 않지만, 나중에 연동 시 필요)
// const API_BASE_URL = 'http://localhost:8080/api'; // 예시 URL

// 더미 고객 데이터 (초기 UI 테스트용)
const DUMMY_CUSTOMERS = [
    { id: 1, uniqueId: 'SB001', name: '김철수', age: 60, gender: '남', subscriptionDate: '2020.01.03~2025.07.18', familyMembers: '자녀 2', marriage: '기혼', children: 2, hasDisease: false, payment: 550, occupation: '교사' },
    { id: 2, uniqueId: 'SB002', name: '김영희', age: 35, gender: '여', subscriptionDate: '2020.01.05~2025.07.18', familyMembers: '미혼', marriage: '미혼', children: 0, hasDisease: true, payment: 480, occupation: '디자이너' },
    { id: 3, uniqueId: 'SB003', name: '이민준', age: 30, gender: '남', subscriptionDate: '2020.01.24~2025.07.18', familyMembers: '기혼', marriage: '기혼', children: 1, hasDisease: false, payment: 620, occupation: '개발자' },
    { id: 4, uniqueId: 'SB004', name: '박지영', age: 70, gender: '여', subscriptionDate: '2020.03.01~2025.07.18', familyMembers: '자녀 4', marriage: '기혼', children: 4, hasDisease: true, payment: 700, occupation: '주부' },
    { id: 5, uniqueId: 'SB005', name: '최현우', age: 25, gender: '남', subscriptionDate: '2020.08.06~2025.07.18', familyMembers: '자녀 1', marriage: '미혼', children: 1, hasDisease: false, payment: 420, occupation: '학생' },
    { id: 6, uniqueId: 'SB006', name: '이지은', age: 55, gender: '여', subscriptionDate: '2020.10.09~2025.07.18', familyMembers: '자녀 X', marriage: '기혼', children: 0, hasDisease: false, payment: 590, occupation: '회사원' },
    { id: 7, uniqueId: 'SB007', name: '강민정', age: 42, gender: '여', subscriptionDate: '2021.05.12~2026.05.12', familyMembers: '자녀 2', marriage: '기혼', children: 2, hasDisease: false, payment: 510, occupation: '자영업자' },
    { id: 8, uniqueId: 'SB008', name: '오준호', age: 28, gender: '남', subscriptionDate: '2022.02.20~2027.02.20', familyMembers: '미혼', marriage: '미혼', children: 0, hasDisease: false, payment: 380, occupation: '프리랜서' },
    { id: 9, uniqueId: 'SB009', name: '윤서현', age: 33, gender: '여', subscriptionDate: '2023.01.15~2028.01.15', familyMembers: '기혼', marriage: '기혼', children: 1, hasDisease: true, payment: 650, occupation: '의사' },
    { id: 10, uniqueId: 'SB010', name: '정우진', age: 48, gender: '남', subscriptionDate: '2019.11.01~2024.11.01', familyMembers: '자녀 3', marriage: '기혼', children: 3, hasDisease: false, payment: 750, occupation: '엔지니어' },
];

// 메인 App 컴포넌트
const App = () => {
    // 필터링 상태
    const [searchTerm, setSearchTerm] = useState(''); // 고객명 또는 고유번호 통합 검색 필드
    const [ageGroup, setAgeGroup] = useState('전체'); // 나이 필터 (전체, 20대, 30대, ...)
    const [gender, setGender] = useState({ male: false, female: false }); // 성별 필터
    const [disease, setDisease] = useState({ yes: false, no: false }); // 질병 필터
    const [marriageStatus, setMarriageStatus] = useState('전체'); // 결혼 여부 드롭다운
    const [childrenStatus, setChildrenStatus] = useState('전체'); // 자녀 여부 드롭다운
    const [paymentAmount, setPaymentAmount] = useState('전체'); // 납입금 드롭다운

    // 고객 데이터 및 필터링된 고객 데이터
    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]); // 선택된 고객 ID 목록

    // 메시지 관련 상태
    const [messagePreview, setMessagePreview] = useState('메시지 생성 버튼을 클릭하여 메시지를 미리보세요.');
    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const [showSendMessagePopup, setShowSendMessagePopup] = useState(false);

    // 메시지 발송 기록 관련 상태
    const [messageHistory, setMessageHistory] = useState([]);
    const [selectedHistoryCustomer, setSelectedHistoryCustomer] = useState(null); // 모달에 표시될 고객 및 메시지 정보
    const [showHistoryDetail, setShowHistoryDetail] = useState(false);
    const [nextHistoryId, setNextHistoryId] = useState(1); // 더미 기록 ID 생성용

    // 로딩 상태
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 고객 데이터 로드 (더미 데이터 사용)
    const loadCustomers = useCallback(() => {
        setIsLoading(true);
        setError(null);
        // 실제 백엔드 API 호출 대신 더미 데이터를 1초 후 로드하는 것을 시뮬레이션
        setTimeout(() => {
            setAllCustomers(DUMMY_CUSTOMERS);
            setFilteredCustomers(DUMMY_CUSTOMERS); // 초기에는 모든 고객 표시
            setIsLoading(false);
        }, 1000);
    }, []);

    // 메시지 발송 기록 로드 (더미 데이터 사용)
    const loadMessageHistory = useCallback(() => {
        setIsLoading(true);
        setError(null);
        // 실제 백엔드 API 호출 대신 빈 기록을 0.5초 후 로드하는 것을 시뮬레이션
        setTimeout(() => {
            // 초기에는 빈 배열로 시작하거나, 미리 정의된 더미 기록을 넣을 수 있습니다.
            setMessageHistory([]);
            setIsLoading(false);
        }, 500);
    }, []);

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadCustomers();
        loadMessageHistory();
    }, [loadCustomers, loadMessageHistory]);

    // 필터링 적용 함수 (클라이언트 측 필터링 유지)
    const applyFilters = useCallback(() => {
        let tempCustomers = [...allCustomers];

        // 고객명 또는 고객 고유번호 통합 필터
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            tempCustomers = tempCustomers.filter(customer =>
                (customer.name && customer.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (customer.uniqueId && customer.uniqueId.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        // 나이 필터
        if (ageGroup !== '전체') {
            const [minAge, maxAge] = ageGroup.split('~').map(s => parseInt(s.trim()));
            if (ageGroup === '60대 이상') {
                tempCustomers = tempCustomers.filter(customer => customer.age >= 60);
            } else {
                tempCustomers = tempCustomers.filter(customer =>
                    customer.age >= minAge && customer.age <= maxAge
                );
            }
        }

        // 성별 필터
        if (gender.male && !gender.female) {
            tempCustomers = tempCustomers.filter(customer => customer.gender === '남');
        } else if (!gender.male && gender.female) {
            tempCustomers = tempCustomers.filter(customer => customer.gender === '여');
        }

        // 질병 필터
        if (disease.yes && !disease.no) {
            tempCustomers = tempCustomers.filter(customer => customer.hasDisease);
        } else if (!disease.yes && disease.no) {
            tempCustomers = tempCustomers.filter(customer => !customer.hasDisease);
        }

        // 결혼 여부 필터
        if (marriageStatus !== '전체') {
            tempCustomers = tempCustomers.filter(customer => customer.marriage === marriageStatus);
        }

        // 자녀 여부 필터
        if (childrenStatus !== '전체') {
            if (childrenStatus === '있음') {
                tempCustomers = tempCustomers.filter(customer => customer.children > 0);
            } else if (childrenStatus === '없음') {
                tempCustomers = tempCustomers.filter(customer => customer.children === 0);
            }
        }

        // 납입금 필터
        if (paymentAmount !== '전체') {
            const [minPayment, maxPayment] = paymentAmount.split('~').map(s => parseInt(s.trim().replace('만원', '')));
            tempCustomers = tempCustomers.filter(customer =>
                customer.payment >= minPayment && customer.payment < maxPayment
            );
        }

        setFilteredCustomers(tempCustomers);
        // 필터링 후에는 선택된 고객 목록 초기화 (새로운 필터링 결과에 맞춰야 함)
        setSelectedCustomerIds([]);
    }, [allCustomers, searchTerm, ageGroup, gender, disease, marriageStatus, childrenStatus, paymentAmount]);

    // 조회 버튼 클릭 핸들러
    const handleSearch = () => {
        applyFilters(); // 클라이언트 측 필터링
    };

    // 전체 고객 선택/해제 핸들러
    const handleSelectAllCustomers = (e) => {
        if (e.target.checked) {
            const allFilteredCustomerIds = filteredCustomers.map(customer => customer.id);
            setSelectedCustomerIds(allFilteredCustomerIds);
        } else {
            setSelectedCustomerIds([]);
        }
    };

    // 개별 고객 선택/해제 핸들러
    const handleSelectCustomer = (customerId) => {
        setSelectedCustomerIds(prevSelected => {
            if (prevSelected.includes(customerId)) {
                return prevSelected.filter(id => id !== customerId);
            } else {
                return [...prevSelected, customerId];
            }
        });
    };

    // 메시지 생성 버튼 클릭 핸들러 (AI API 호출 시뮬레이션)
    const handleGenerateMessage = async () => {
        if (filteredCustomers.length === 0) {
            setMessagePreview('조회된 고객이 없습니다. 메시지를 생성할 수 없습니다.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setMessagePreview('메시지를 생성 중입니다...');

        // AI API 호출 시뮬레이션 (실제 백엔드 연동 시 이 부분을 fetch로 대체)
        setTimeout(() => {
            const customer = filteredCustomers[0]; // 첫 번째 고객 정보만 사용 예시
            const generatedText = `고객님(${customer.name}님)! ${customer.age}세 ${customer.gender}성 고객님이시군요. ${customer.marriage === '기혼' ? '결혼하셨고 ' + customer.children + '명의 자녀가 있으시네요.' : '아직 미혼이시군요.'} 납입금 ${customer.payment}만원에 맞는 최적의 전환 서비스를 추천드립니다. 자세한 내용은 문의해주세요.`;
            setMessagePreview(generatedText);
            setIsEditingMessage(false); // 새로 생성되면 수정 모드 해제
            setIsLoading(false);
        }, 1500); // 1.5초 지연 시뮬레이션
    };

    // 메시지 수정 버튼 클릭 핸들러
    const handleEditMessage = () => {
        setIsEditingMessage(true);
    };

    // 메시지 전송 버튼 클릭 핸들러 (백엔드 API 호출 시뮬레이션)
    const handleSendMessage = async () => {
        if (!messagePreview || messagePreview === '메시지 생성 버튼을 클릭하여 메시지를 미리보세요.') {
            setError('전송할 메시지가 없습니다.');
            return;
        }
        if (selectedCustomerIds.length === 0) { // 선택된 고객이 없을 경우
            setError('전송할 고객을 선택해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);

        // 메시지 전송 시뮬레이션 (실제 백엔드 연동 시 이 부분을 fetch로 대체)
        setTimeout(() => {
            const sentCustomersData = selectedCustomerIds.map(id => {
                const customer = allCustomers.find(c => c.id === id);
                return {
                    id: nextHistoryId + id, // 더미 기록 ID는 고유하게 생성
                    customerId: customer.id,
                    customerName: customer.name,
                    messageContent: messagePreview,
                    timestamp: Date.now(),
                    status: '전송 완료',
                    // 실제 이미지 URL이 있다면 여기에 추가
                    imageUrl: `https://placehold.co/150x100/E0E7FF/4F46E5?text=Image+for+${customer.name}` // 더미 이미지
                };
            });

            // 기존 기록에 새 기록 추가 (불변성 유지를 위해 새 배열 생성)
            setMessageHistory(prevHistory => [...sentCustomersData, ...prevHistory].sort((a,b) => b.timestamp - a.timestamp));
            setNextHistoryId(prevId => prevId + sentCustomersData.length); // 다음 ID 업데이트

            setShowSendMessagePopup(true);
            setIsLoading(false);
            // 전송 후 선택 해제
            setSelectedCustomerIds([]);
            setTimeout(() => setShowSendMessagePopup(false), 3000); // 3초 후 팝업 닫기
        }, 1000); // 1초 지연 시뮬레이션
    };

    // 고객 정보 테이블에서 이름 클릭 시 상세 모달 표시
    const handleCustomerTableClick = (customer) => {
        // 해당 고객에게 보낸 가장 최근 메시지 찾기
        const latestMessage = messageHistory
            .filter(item => item.customerId === customer.id)
            .sort((a, b) => b.timestamp - a.timestamp)[0]; // 가장 최근 기록

        setSelectedHistoryCustomer({
            customerDetails: customer, // 고객 상세 정보
            // 메시지 내용 및 이미지: 가장 최근 메시지에서 가져오거나, 없으면 기본값
            messageContent: latestMessage ? latestMessage.messageContent : '해당 고객에게 전송된 메시지가 없습니다.',
            imageUrl: latestMessage ? latestMessage.imageUrl : 'https://placehold.co/150x100/CCCCCC/666666?text=No+Image',
            timestamp: latestMessage ? latestMessage.timestamp : null,
        });
        setShowHistoryDetail(true);
    };

    // 메시지 발송 기록 테이블에서 이름 클릭 시 상세 모달 표시
    const handleMessageHistoryTableClick = (historyItem) => {
        // historyItem에 포함된 customerId로 고객 상세 정보 찾기
        const customer = allCustomers.find(c => c.id === historyItem.customerId);
        setSelectedHistoryCustomer({
            customerDetails: customer, // 고객 상세 정보
            messageContent: historyItem.messageContent, // 해당 기록의 메시지 내용
            imageUrl: historyItem.imageUrl, // 해당 기록의 이미지
            timestamp: historyItem.timestamp, // 해당 기록의 타임스탬프
        });
        setShowHistoryDetail(true);
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setShowHistoryDetail(false);
        setSelectedHistoryCustomer(null);
    };

    // 전체 선택 체크박스의 indeterminate 상태 (일부만 선택되었을 때)
    const isAllSelected = filteredCustomers.length > 0 && selectedCustomerIds.length === filteredCustomers.length;
    const isIndeterminate = selectedCustomerIds.length > 0 && selectedCustomerIds.length < filteredCustomers.length;


    // 로딩 중 또는 에러 메시지 표시 UI
    if (isLoading && !showSendMessagePopup) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-lg font-semibold text-gray-700">데이터 로딩 중...</div>
            </div>
        );
    }

    if (error && !showSendMessagePopup) { // 메시지 전송 팝업과 동시에 에러 팝업이 뜨지 않도록
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
                    <AlertCircle className="h-6 w-6" />
                    <span>오류: {error}</span>
                    <button onClick={() => setError(null)} className="ml-4 text-red-700 hover:text-red-900 font-bold">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-800 p-4 sm:p-6 lg:p-8">
            {/* 상단 메뉴바는 제외 (요청사항) */}

            {/* 검색 및 필터링 섹션 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <Search className="mr-2 text-blue-500" size={24} /> 고객 조회 및 필터링
                </h2>
                {/* 필터링 입력 필드를 한 줄에 배치 */}
                <div className="flex flex-wrap items-end gap-x-4 gap-y-4 mb-6">
                    {/* 고객명 또는 고유번호 통합 입력 */}
                    <div className="flex-grow">
                        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">고객명 또는 고유번호</label>
                        <input
                            type="text"
                            id="searchTerm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="고객명 또는 고유번호 입력"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* 나이 드롭다운 */}
                    <div className="w-auto min-w-[100px]">
                        <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                        <select
                            id="ageGroup"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={ageGroup}
                            onChange={(e) => setAgeGroup(e.target.value)}
                        >
                            <option value="전체">전체</option>
                            <option value="20~29">20대</option>
                            <option value="30~39">30대</option>
                            <option value="40~49">40대</option>
                            <option value="50~59">50대</option>
                            <option value="60대 이상">60대 이상</option>
                        </select>
                    </div>
                    {/* 성별 체크박스 */}
                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                        <div className="flex items-center space-x-3 h-[42px]"> {/* 높이 맞춰주기 */}
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={gender.male}
                                    onChange={(e) => setGender({ ...gender, male: e.target.checked })}
                                />
                                <span className="ml-2 text-gray-700">남</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={gender.female}
                                    onChange={(e) => setGender({ ...gender, female: e.target.checked })}
                                />
                                <span className="ml-2 text-gray-700">여</span>
                            </label>
                        </div>
                    </div>
                    {/* 질병 체크박스 */}
                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">질병</label>
                        <div className="flex items-center space-x-3 h-[42px]"> {/* 높이 맞춰주기 */}
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={disease.yes}
                                    onChange={(e) => setDisease({ ...disease, yes: e.target.checked })}
                                />
                                <span className="ml-2 text-gray-700">유</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={disease.no}
                                    onChange={(e) => setDisease({ ...disease, no: e.target.checked })}
                                />
                                <span className="ml-2 text-gray-700">무</span>
                            </label>
                        </div>
                    </div>
                    {/* 결혼 여부 드롭다운 */}
                    <div className="w-auto min-w-[100px]">
                        <label htmlFor="marriageStatus" className="block text-sm font-medium text-gray-700 mb-1">결혼</label>
                        <select
                            id="marriageStatus"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={marriageStatus}
                            onChange={(e) => setMarriageStatus(e.target.value)}
                        >
                            <option value="전체">전체</option>
                            <option value="기혼">기혼</option>
                            <option value="미혼">미혼</option>
                        </select>
                    </div>
                    {/* 자녀 여부 드롭다운 */}
                    <div className="w-auto min-w-[100px]">
                        <label htmlFor="childrenStatus" className="block text-sm font-medium text-gray-700 mb-1">자녀</label>
                        <select
                            id="childrenStatus"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={childrenStatus}
                            onChange={(e) => setChildrenStatus(e.target.value)}
                        >
                            <option value="전체">전체</option>
                            <option value="있음">있음</option>
                            <option value="없음">없음</option>
                        </select>
                    </div>
                    {/* 납입금 드롭다운 */}
                    <div className="w-auto min-w-[120px]">
                        <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-1">납입금</label>
                        <select
                            id="paymentAmount"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        >
                            <option value="전체">전체</option>
                            <option value="300~399만원">300~399만원</option>
                            <option value="400~499만원">400~499만원</option>
                            <option value="500~599만원">500~599만원</option>
                            <option value="600~699만원">600~699만원</option>
                            <option value="700만원 이상">700만원 이상</option>
                        </select>
                    </div>
                    {/* 조회 버튼 */}
                    <div className="flex-shrink-0 ml-auto"> {/* 버튼을 오른쪽 끝으로 정렬 */}
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center h-[42px]" // 높이 맞춰주기
                        >
                            <Search className="mr-2" size={20} /> 조회
                        </button>
                    </div>
                </div>
            </div>

            {/* 고객 정보 테이블 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <User className="mr-2 text-green-500" size={24} /> 고객 정보
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        checked={isAllSelected}
                                        onChange={handleSelectAllCustomers}
                                        ref={el => el && (el.indeterminate = isIndeterminate)} // indeterminate 상태 설정
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객 고유번호</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">나이</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성별</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">납입기간</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가족 구성원</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">납입금 (만원)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                checked={selectedCustomerIds.includes(customer.id)}
                                                onChange={() => handleSelectCustomer(customer.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.uniqueId}</td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                                            onClick={() => handleCustomerTableClick(customer)} // 고객 정보 테이블에서 이름 클릭 시
                                        >
                                            {customer.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.age}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.subscriptionDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.familyMembers}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.payment}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        조회된 고객 정보가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 메시지 미리보기 및 발송 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 메시지 미리보기 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <MessageSquare className="mr-2 text-purple-500" size={24} /> 메시지 미리보기
                    </h2>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-48 overflow-y-auto mb-4 relative">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                <span className="ml-3 text-blue-600">메시지 생성 중...</span>
                            </div>
                        )}
                        {isEditingMessage ? (
                            <textarea
                                className="w-full h-full bg-transparent focus:outline-none resize-none"
                                value={messagePreview}
                                onChange={(e) => setMessagePreview(e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-700 whitespace-pre-wrap">{messagePreview}</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleGenerateMessage}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center"
                            disabled={isLoading}
                        >
                            <CheckCircle className="mr-2" size={20} /> 메시지 생성
                        </button>
                        <button
                            onClick={handleEditMessage}
                            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center"
                            disabled={isLoading}
                        >
                            <Edit className="mr-2" size={20} /> 메시지 수정
                        </button>
                        <button
                            onClick={handleSendMessage}
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center"
                            disabled={isLoading || selectedCustomerIds.length === 0} // 선택된 고객이 없으면 비활성화
                        >
                            <Send className="mr-2" size={20} /> 메시지 전송
                        </button>
                    </div>
                </div>

                {/* 고객 정보 및 메시지 발송 기록 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <History className="mr-2 text-orange-500" size={24} /> 메시지 발송 기록
                    </h2>
                    <div className="overflow-y-auto h-80 rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객명</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">발송일</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {messageHistory.length > 0 ? (
                                    messageHistory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleMessageHistoryTableClick(item)}> {/* 메시지 발송 기록 테이블에서 이름 클릭 시 */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">{item.customerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(item.timestamp).toLocaleDateString('ko-KR')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            발송 기록이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 메시지 전송 완료 팝업 */}
            {showSendMessagePopup && (
                <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-fade-in-up z-50">
                    <CheckCircle className="h-6 w-6" />
                    <span>메시지 전송이 완료되었습니다!</span>
                </div>
            )}

            {/* 메시지 발송 기록 상세 모달 */}
            {showHistoryDetail && selectedHistoryCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl transform transition-all scale-100 opacity-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                <History className="mr-2 text-orange-500" size={24} /> 발송 기록 상세
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 transition duration-200"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 왼쪽: 고객 정보 */}
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <p className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <User className="mr-2 text-blue-500" size={20} /> 고객 정보
                                </p>
                                {selectedHistoryCustomer.customerDetails ? (
                                    <div className="space-y-2 text-gray-700">
                                        <p><span className="font-medium">고객명:</span> {selectedHistoryCustomer.customerDetails.name} ({selectedHistoryCustomer.customerDetails.uniqueId})</p>
                                        <p><span className="font-medium">나이:</span> {selectedHistoryCustomer.customerDetails.age}</p>
                                        <p><span className="font-medium">성별:</span> {selectedHistoryCustomer.customerDetails.gender}</p>
                                        <p><span className="font-medium">직업:</span> {selectedHistoryCustomer.customerDetails.occupation || '정보 없음'}</p>
                                        <p><span className="font-medium">결혼:</span> {selectedHistoryCustomer.customerDetails.marriage}</p>
                                        <p><span className="font-medium">자녀:</span> {selectedHistoryCustomer.customerDetails.children}명</p>
                                        <p><span className="font-medium">질병:</span> {selectedHistoryCustomer.customerDetails.hasDisease ? '유' : '무'}</p>
                                        <p><span className="font-medium">납입금:</span> {selectedHistoryCustomer.customerDetails.payment}만원</p>
                                        <p><span className="font-medium">납입기간:</span> {selectedHistoryCustomer.customerDetails.subscriptionDate}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">고객 정보를 불러오는 중...</p>
                                )}
                            </div>

                            {/* 오른쪽: 발송 메시지 내용 및 이미지 */}
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col">
                                <p className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <MessageSquare className="mr-2 text-purple-500" size={20} /> 발송 메시지 내용
                                </p>
                                <div className="flex-grow overflow-y-auto mb-4">
                                    {/* 이미지 (플레이스홀더) */}
                                    {selectedHistoryCustomer.imageUrl && (
                                        <img
                                            src={selectedHistoryCustomer.imageUrl}
                                            alt="메시지 관련 이미지"
                                            className="w-full h-auto rounded-md mb-3 object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x100/CCCCCC/666666?text=No+Image'; }}
                                        />
                                    )}
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedHistoryCustomer.messageContent}</p>
                                </div>
                                <div className="flex justify-end items-center mt-auto border-t pt-4">
                                    {selectedHistoryCustomer.timestamp && (
                                        <p className="text-sm text-gray-500 mr-4">발송일: {new Date(selectedHistoryCustomer.timestamp).toLocaleString('ko-KR')}</p>
                                    )}
                                    <button
                                        // 실제 재전송 로직은 백엔드 API 호출로 구현
                                        onClick={() => alert('재전송 기능은 백엔드 연동이 필요합니다.')}
                                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center"
                                    >
                                        <RefreshCcw className="mr-2" size={18} /> 재전송
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-6 text-center">
                            * 이 고객 정보 및 메시지 기록은 현재 테스트용 더미 데이터이며, 실제 서비스에서는 백엔드와 연동하여 관리됩니다.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
