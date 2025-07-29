import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';

const Menu1 = () => {
  const [activeTab, setActiveTab] = useState('death-certificate');
  const [formData, setFormData] = useState({
    deceasedName: '',
    deceasedBirth: '',
    deceasedDeath: '',
    deceasedAddress: '',
    familyName: '',
    familyRelation: '',
    familyPhone: '',
    familyAddress: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 호출 로직 구현
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const generateDocument = () => {
    // TODO: 문서 생성 로직 구현
    alert('문서가 생성되었습니다. 다운로드를 시작합니다.');
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>장례 서류 작성</h1>
          <p className="lead">필요한 장례 관련 서류를 자동으로 작성할 수 있습니다.</p>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
          서류가 성공적으로 작성되었습니다!
        </Alert>
      )}

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="death-certificate" title="사망신고서">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <h5>고인 정보</h5>
                        <Form.Group className="mb-3">
                          <Form.Label>성명</Form.Label>
                          <Form.Control
                            type="text"
                            name="deceasedName"
                            value={formData.deceasedName}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>생년월일</Form.Label>
                          <Form.Control
                            type="date"
                            name="deceasedBirth"
                            value={formData.deceasedBirth}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>사망일시</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="deceasedDeath"
                            value={formData.deceasedDeath}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>주소</Form.Label>
                          <Form.Control
                            type="text"
                            name="deceasedAddress"
                            value={formData.deceasedAddress}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <h5>신고인 정보</h5>
                        <Form.Group className="mb-3">
                          <Form.Label>성명</Form.Label>
                          <Form.Control
                            type="text"
                            name="familyName"
                            value={formData.familyName}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>고인과의 관계</Form.Label>
                          <Form.Select
                            name="familyRelation"
                            value={formData.familyRelation}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">선택하세요</option>
                            <option value="배우자">배우자</option>
                            <option value="자녀">자녀</option>
                            <option value="부모">부모</option>
                            <option value="형제자매">형제자매</option>
                            <option value="기타">기타</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>연락처</Form.Label>
                          <Form.Control
                            type="tel"
                            name="familyPhone"
                            value={formData.familyPhone}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>주소</Form.Label>
                          <Form.Control
                            type="text"
                            name="familyAddress"
                            value={formData.familyAddress}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2">
                      <Button type="submit" variant="primary">
                        <i className="fas fa-save"></i> 저장
                      </Button>
                      <Button type="button" variant="success" onClick={generateDocument}>
                        <i className="fas fa-download"></i> 문서 생성
                      </Button>
                    </div>
                  </Form>
                </Tab>

                <Tab eventKey="burial-permit" title="매장허가서">
                  <div className="text-center p-5">
                    <i className="fas fa-tools fa-3x text-muted mb-3"></i>
                    <h5>준비 중입니다</h5>
                    <p className="text-muted">매장허가서 작성 기능을 준비 중입니다.</p>
                  </div>
                </Tab>

                <Tab eventKey="funeral-report" title="장례신고서">
                  <div className="text-center p-5">
                    <i className="fas fa-tools fa-3x text-muted mb-3"></i>
                    <h5>준비 중입니다</h5>
                    <p className="text-muted">장례신고서 작성 기능을 준비 중입니다.</p>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>작성 가이드</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li>모든 필수 항목을 정확히 입력해주세요.</li>
                <li>고인의 정보는 공식 문서와 일치해야 합니다.</li>
                <li>신고인은 고인과의 관계를 명확히 기재해주세요.</li>
                <li>생성된 문서는 관할 행정기관에 제출하시면 됩니다.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Menu1;
