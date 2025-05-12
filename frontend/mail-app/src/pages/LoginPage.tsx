import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useUserStore } from '../shared/stores/useUserStore';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Typography } from '@/shared/components/atoms/Typography';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: 실제 API 연동
      // const response = await api.post('/auth/login', { email, password });
      // const { accessToken, user } = response.data;
      
      // 임시로 로그인 성공했다고 가정
      const mockUser = {
        id: '1',
        email: email,
        name: '테스트 유저',
      };
      const mockToken = 'mock-access-token';
      
      // 토큰 저장
      localStorage.setItem('accessToken', mockToken);
      // 유저 정보 저장
      login(mockUser, mockToken);
      
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Typography variant="titleLarge" bold className="text-center mb-8">
          로그인
        </Typography>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Typography variant="body" color="text-gray-600" className="mb-2">
              이메일
            </Typography>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              size="large"
            />
          </InputGroup>
          <InputGroup>
            <Typography variant="body" color="text-gray-600" className="mb-2">
              비밀번호
            </Typography>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              size="large"
            />
          </InputGroup>
          <Button 
            type="submit" 
            size="large" 
            variant="primary"
            className="w-full mt-6"
          >
            로그인
          </Button>
        </Form>
      </LoginBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export default LoginPage;
