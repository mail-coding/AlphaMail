import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useUserStore } from '../shared/stores/useUserStore';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Typography } from '@/shared/components/atoms/Typography';
import { login as loginService } from '../features/auth/services/loginService';
import { useQueryClient } from '@tanstack/react-query';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginService(email, password);
      console.log('로그인 성공! 액세스 토큰:', response.accessToken);
      
      // 로그인 성공 후 사용자 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // 토큰 저장
      setAuth(response.accessToken);
      
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
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
