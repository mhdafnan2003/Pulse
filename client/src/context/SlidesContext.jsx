import { createContext, useContext, useState, useCallback } from 'react';
import { slidesApi } from '../api';

const SlidesContext = createContext(null);

export const SlidesProvider = ({ children }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlides = useCallback(async (adminMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = adminMode ? await slidesApi.getAll() : await slidesApi.getPublic();
      setSlides(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load slides');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SlidesContext.Provider value={{ slides, loading, error, fetchSlides, setSlides }}>
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = () => {
  const ctx = useContext(SlidesContext);
  if (!ctx) throw new Error('useSlides must be used within SlidesProvider');
  return ctx;
};
