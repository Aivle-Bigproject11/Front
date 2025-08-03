import React from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const UserConfig = () => {
  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">사용자 정보</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>사용자명</Form.Label>
              <Form.Control type="text" placeholder="테스트관리자" readOnly />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>이메일</Form.Label>
              <Form.Control type="email" placeholder="test@example.com" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>새 비밀번호</Form.Label>
              <Form.Control type="password" placeholder="새 비밀번호" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>새 비밀번호 확인</Form.Label>
              <Form.Control type="password" placeholder="새 비밀번호 확인" />
            </Form.Group>

            <Button variant="primary" type="submit">
              정보 수정
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserConfig;
