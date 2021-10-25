import styled from 'styled-components/macro';
const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoginButton = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-lg);
  padding: var(--spacing-sm) var(--spacing-xl);

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

const Login = () => {
  return (
    <StyledLoginContainer>
      <StyledLoginButton href="http://localhost:8888/login">
        Login to Spotify
      </StyledLoginButton>
    </StyledLoginContainer>
  );
};

export default Login;
