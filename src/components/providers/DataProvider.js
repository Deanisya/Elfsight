import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const API_URL = 'https://rickandmortyapi.com/api/character/';
const ALLOWED_QUERY_PARAMS = [
  'name',
  'type',
  'status',
  'gender',
  'species',
  'page'
];

function getInitialQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const normalizedParams = new URLSearchParams();

  ALLOWED_QUERY_PARAMS.forEach((param) => {
    const value = searchParams.get(param);

    if (value) {
      normalizedParams.set(param, value);
    }
  });

  return normalizedParams;
}

export function DataProvider({ children }) {
  const initialQueryParams = getInitialQueryParams();
  const initialPage = Number(initialQueryParams.get('page')) || 1;
  const [activePage, setActivePage] = useState(initialPage - 1);
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [info, setInfo] = useState({});
  const [apiURL, setApiURL] = useState(() => {
    const queryString = initialQueryParams.toString();

    return queryString ? `${API_URL}?${queryString}` : API_URL;
  });

  const fetchData = useCallback(async (url) => {
    setIsFetching(true);
    setIsError(false);

    axios
      .get(url)
      .then(({ data }) => {
        setIsFetching(false);
        setCharacters(data.results);
        setInfo(data.info);
        // console.log(data.results);
      })
      .catch((e) => {
        setIsFetching(false);
        setIsError(true);
        console.error(e);
      });
  }, []);

  useEffect(() => {
    fetchData(apiURL);
  }, [apiURL, fetchData]);

  useEffect(() => {
    const url = new URL(apiURL);
    const queryString = url.searchParams.toString();
    const nextRelativeURL = `${window.location.pathname}${
      queryString ? `?${queryString}` : ''
    }`;

    if (
      `${window.location.pathname}${window.location.search}` !== nextRelativeURL
    ) {
      window.history.replaceState({}, '', nextRelativeURL);
    }
  }, [apiURL]);

  const dataValue = useMemo(
    () => ({
      activePage,
      setActivePage,
      apiURL,
      setApiURL,
      characters,
      fetchData,
      isFetching,
      isError,
      info
    }),
    [activePage, apiURL, characters, isFetching, isError, info, fetchData]
  );

  return (
    <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
  );
}

const DataContext = createContext({});

export const useData = () => useContext(DataContext);
