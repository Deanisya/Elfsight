import styled from 'styled-components';
import {
  Pagination,
  ItemsGrid,
  useData,
  Header,
  AppState,
  FiltersBar
} from './components';
import { useCharacterFilters } from './hooks/useCharacterFilters';

export function App() {
  const { isFetching, isError } = useData();
  const {
    selectedName,
    setSelectedName,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    selectedGender,
    setSelectedGender,
    selectedSpecies,
    setSelectedSpecies,
    statusOptions,
    genderOptions,
    speciesOptions,
    applyFilters,
    resetFilters
  } = useCharacterFilters();

  return (
    <Main>
      {!isFetching && !isError && (
        <>
          <TopSection>
            <Header />
            <FiltersBar
              selectedName={selectedName}
              setSelectedName={setSelectedName}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              selectedSpecies={selectedSpecies}
              setSelectedSpecies={setSelectedSpecies}
              statusOptions={statusOptions}
              genderOptions={genderOptions}
              speciesOptions={speciesOptions}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
          </TopSection>

          <ContentSection>
            <ItemsGrid />
            <Pagination />
          </ContentSection>
        </>
      )}
      <AppState />
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 0;
  max-width: 80%;
  margin: 0 auto;
`;

const TopSection = styled.section`
  display: flex;

  @media (max-width: 951px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
