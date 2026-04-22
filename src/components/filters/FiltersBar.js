import { useMemo } from 'react';
import styled from 'styled-components';
import { Dropdown } from '../common';

export function FiltersBar({
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
}) {
  const onNameChange = useMemo(
    () => (event) => setSelectedName(event.target.value || null),
    [setSelectedName]
  );
  const onTypeChange = useMemo(
    () => (event) => setSelectedType(event.target.value || null),
    [setSelectedType]
  );

  return (
    <FilterForm>
      <DropdownRow>
        <Dropdown
          className="dropdown-item"
          options={statusOptions}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Status"
        />
        <Dropdown
          className="dropdown-item"
          options={genderOptions}
          value={selectedGender}
          onChange={setSelectedGender}
          placeholder="Gender"
        />
        <Dropdown
          className="dropdown-item"
          options={speciesOptions}
          value={selectedSpecies}
          onChange={setSelectedSpecies}
          placeholder="Species"
        />
      </DropdownRow>
      <ControlsRow>
        <FilterInput
          type="text"
          value={selectedName || ''}
          onChange={onNameChange}
          placeholder="Name"
        />
        <FilterInput
          type="text"
          value={selectedType || ''}
          onChange={onTypeChange}
          placeholder="Type"
        />
        <FilterButton type="button" onClick={applyFilters}>
          Apply
        </FilterButton>
        <FilterButton type="button" onClick={resetFilters} secondary>
          Reset
        </FilterButton>
      </ControlsRow>
    </FilterForm>
  );
}

const FilterForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 951px) {
    align-items: center;
  }
`;

const DropdownRow = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 12px;

  .dropdown-item {
    width: 180px;
    max-width: 180px;
  }
  @media (min-width: 1200px) {
    .dropdown-item {
      flex: 0 0 180px;
    }
  }
  @media (max-width: 950px) {
    .dropdown-item {
      width: 150px;
      max-width: 150px;
    }
  }

  @media (max-width: 530px) {
    flex-direction: column;
    align-items: center;

    .dropdown-item {
      width: 240px;
      max-width: 240px;
    }
  }
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 530px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FilterButton = styled.button`
  width: 85px;
  min-width: 85px;
  height: 40px;
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border: 1px solid ${({ secondary }) => (secondary ? '#FF5152' : '#83BF46')};
  color: ${({ secondary }) => (secondary ? '#FF5152' : '#83BF46')};
  background: transparent;

  @media (max-width: 950px) {
    width: 70px;
    min-width: 70px;
  }

  @media (max-width: 530px) {
    width: 240px;
    min-width: 240px;
  }
`;

const FilterInput = styled.input`
  width: 180px;
  max-width: 180px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #83bf46;
  background: #263750;
  color: #fff;
  padding: 10px 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 950px) {
    width: 150px;
    max-width: 150px;
  }

  @media (max-width: 530px) {
    width: 240px;
    max-width: 240px;
  }

  &:focus {
    background: #334466;
    text-overflow: clip;
  }

  &::placeholder {
    color: #9aadc9;
  }
`;
