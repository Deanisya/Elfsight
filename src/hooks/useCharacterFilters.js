import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useData } from '../components';
import { createOptionsFromField } from '../utils/createOptionsFromField';

const API_URL = 'https://rickandmortyapi.com/api/character/';

function getFiltersFromURL() {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    name: searchParams.get('name') || null,
    type: searchParams.get('type') || null,
    status: searchParams.get('status') || null,
    gender: searchParams.get('gender') || null,
    species: searchParams.get('species') || null
  };
}

function getFiltersFromApiURL(url) {
  const searchParams = new URL(url).searchParams;

  return {
    name: searchParams.get('name') || null,
    type: searchParams.get('type') || null,
    status: searchParams.get('status') || null,
    gender: searchParams.get('gender') || null,
    species: searchParams.get('species') || null
  };
}

function buildApiURL({ name, type, status, gender, species, page = 1 }) {
  const url = new URL(API_URL);

  if (name) {
    url.searchParams.set('name', name);
  }

  if (type) {
    url.searchParams.set('type', type);
  }

  if (status) {
    url.searchParams.set('status', status);
  }

  if (gender) {
    url.searchParams.set('gender', gender);
  }

  if (species) {
    url.searchParams.set('species', species);
  }

  if (page > 1 || name || type || status || gender || species) {
    url.searchParams.set('page', page);
  }

  return url.toString();
}

export function useCharacterFilters() {
  const { apiURL, setApiURL, setActivePage } = useData();
  const [selectedStatus, setSelectedStatus] = useState(
    () => getFiltersFromURL().status
  );
  const [selectedGender, setSelectedGender] = useState(
    () => getFiltersFromURL().gender
  );
  const [selectedSpecies, setSelectedSpecies] = useState(
    () => getFiltersFromURL().species
  );
  const [selectedName, setSelectedName] = useState(
    () => getFiltersFromURL().name
  );
  const [selectedType, setSelectedType] = useState(
    () => getFiltersFromURL().type
  );
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [speciesOptions, setSpeciesOptions] = useState([]);

  const syncFiltersFromURL = useCallback((url = null) => {
    const { name, type, status, gender, species } = url
      ? getFiltersFromApiURL(url)
      : getFiltersFromURL();

    setSelectedName(name);
    setSelectedType(type);
    setSelectedStatus(status);
    setSelectedGender(gender);
    setSelectedSpecies(species);
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data } = await axios.get(API_URL);
      const firstPageCharacters = data.results || [];
      const pagesCount = data.info?.pages || 1;
      const pageRequests = Array.from({ length: pagesCount - 1 }, (_, index) =>
        axios.get(`${API_URL}?page=${index + 2}`)
      );
      const pagesResponses = await Promise.all(pageRequests);
      const allCharacters = pagesResponses.reduce(
        (accumulator, response) => [
          ...accumulator,
          ...(response.data.results || [])
        ],
        firstPageCharacters
      );

      setStatusOptions(createOptionsFromField(allCharacters, 'status'));
      setGenderOptions(createOptionsFromField(allCharacters, 'gender'));
      setSpeciesOptions(createOptionsFromField(allCharacters, 'species'));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const applyFilters = useCallback(() => {
    setActivePage(0);
    setApiURL(
      buildApiURL({
        name: selectedName,
        type: selectedType,
        status: selectedStatus,
        gender: selectedGender,
        species: selectedSpecies,
        page: 1
      })
    );
  }, [
    selectedName,
    selectedType,
    selectedStatus,
    selectedGender,
    selectedSpecies,
    setActivePage,
    setApiURL
  ]);

  const resetFilters = useCallback(() => {
    setSelectedName(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setSelectedGender(null);
    setSelectedSpecies(null);
    setActivePage(0);
    setApiURL(API_URL);
  }, [setActivePage, setApiURL]);

  useEffect(() => {
    fetchFilterOptions();
    syncFiltersFromURL();
  }, [fetchFilterOptions, syncFiltersFromURL]);

  useEffect(() => {
    syncFiltersFromURL(apiURL);
  }, [apiURL, syncFiltersFromURL]);

  useEffect(() => {
    const onPopState = () => {
      syncFiltersFromURL();
      const searchParams = new URLSearchParams(window.location.search);
      const page = Number(searchParams.get('page')) || 1;

      setActivePage(page - 1);
      setApiURL(buildApiURL({ ...getFiltersFromURL(), page }));
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [setActivePage, setApiURL, syncFiltersFromURL]);

  return {
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
  };
}
