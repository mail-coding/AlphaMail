import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleGoHome = () => {
    navigate('/'); // 홈으로 이동
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <ErrorSection>
          <ErrorCode>404</ErrorCode>
          <ErrorTitle>페이지를 찾을 수 없습니다</ErrorTitle>
          <ErrorDescription>
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </ErrorDescription>
          
          <ButtonGroup>
            <BackButton onClick={handleGoBack}>
              이전 페이지로
            </BackButton>
            <HomeButton onClick={handleGoHome}>
              홈으로 돌아가기
            </HomeButton>
          </ButtonGroup>
        </ErrorSection>
              </ContentWrapper>
    </PageContainer>
  );
};

// 스타일 컴포넌트
const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #A0C4FF 0%, #5B9AFF 100%);
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  max-width: 1000px;
  width: 90%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ErrorSection = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ErrorCode = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  color: #4784F9;
  margin: 0;
  line-height: 1;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 1rem 0;
  text-align: center;
`;

const ErrorDescription = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.5;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const BackButton = styled(Button)`
  background: #f1f5f9;
  color: #4784F9;
  border: 1px solid #e2e8f0;
  
  &:hover {
    background: #e2e8f0;
  }
`;

const HomeButton = styled(Button)`
  background: linear-gradient(135deg, #93B7FF 0%, #4784F9 100%);
  color: white;
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #7EABFF 0%, #3A75E6 100%);
    box-shadow: 0 4px 8px rgba(71, 132, 249, 0.2);
  }
`;


export default NotFound;