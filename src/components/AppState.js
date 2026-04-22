import { useCallback } from 'react';
import styled from 'styled-components';
import { Loader, Text } from './common';
import { useData } from './providers';

const API_URL = 'https://rickandmortyapi.com/api/character/';

export function AppState() {
  const { isFetching, isError, setApiURL, setActivePage } = useData();

  const handleBackClick = useCallback(() => {
    setActivePage(0);
    setApiURL(API_URL);
  }, [setActivePage, setApiURL]);

  if (isError) {
    return (
      <AppStateContainer>
        <Text>An error has occurred. Try other search parameters.</Text>
        <BackButton type="button" onClick={handleBackClick}>
          Вернуться
        </BackButton>
      </AppStateContainer>
    );
  }

  if (isFetching) {
    return (
      <AppStateContainer>
        <Loader />
      </AppStateContainer>
    );
  }

  return null;
}

const AppStateContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
  background: #83bf46;
  color: #fff;
`;
