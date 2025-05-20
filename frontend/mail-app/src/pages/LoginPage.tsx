import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useUserStore } from '../shared/stores/useUserStore';
import { login as loginService } from '../features/auth/services/loginService';
import { useQueryClient } from '@tanstack/react-query';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 도메인 자동 추가 기능 - 이메일에 @ 없으면 alphamail.my 도메인 추가
      const emailToSubmit = email.includes('@') ? email : `${email}@alphamail.my`;
      const response = await loginService(emailToSubmit, password);
      
      // 로그인 성공 후 사용자 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // 토큰 저장
      setAuth(response.accessToken);
      
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      {/* 배경 영역 */}
      <BackgroundContainer>
        <HeaderSection>
          <Title>ALPHAMAIL</Title>
          <Subtitle>비즈니스 이메일 자동화 솔루션</Subtitle>
        </HeaderSection>
        
      </BackgroundContainer>
      
      {/* 로그인 폼 */}
      <LoginCardSection>
        <LoginCard>
          <FormTitle>로그인</FormTitle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleSubmit}>
            <InputField
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
            />
            
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
            
            <InputHint>@alphamail.my 도메인은 자동으로 추가됩니다</InputHint>
            
            <LoginButton 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </LoginButton>
          </Form>
        </LoginCard>
      </LoginCardSection>
    </PageContainer>
  );
};

// 스타일 컴포넌트
const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const BackgroundContainer = styled.div`
  position: relative;
  flex: 1;
  background: linear-gradient(135deg, #93B7FF 0%, #4784F9 100%);
  overflow: hidden;
  
  // 곡선 모양 생성
// 곡선 모양 생성 - 가운데가 더 볼록한 버전
&::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background-color: #f8fafc;
  border-radius: 50% 0 0 50% / 50% 0 0 50%; /* 더 볼록한 곡선 */
  transform: translateX(15%); /* 약간 덜 밀어내기 */
}
`;

const HeaderSection = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: white;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.2rem;
`;


const LoginCardSection = styled.div`
  position: absolute;
  top: 50%;
  left: 20%;
  transform: translateY(-50%);
  width: 100%;
  max-width: 380px;
  z-index: 2;
`;

const LoginCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  background-color: #f1f5f9;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4784F9;
    box-shadow: 0 0 0 3px rgba(71, 132, 249, 0.1);
    background-color: white;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const InputHint = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: -0.6rem;
  text-align: right;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #93B7FF 0%, #4784F9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #7EABFF 0%, #3A75E6 100%);
    box-shadow: 0 4px 8px rgba(71, 132, 249, 0.2);
  }

  &:disabled {
    background: linear-gradient(135deg, #C6D8FF 0%, #94B8FF 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border-left: 3px solid #b91c1c;
`;

export default LoginPage;