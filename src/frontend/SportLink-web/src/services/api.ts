// src/services/api.ts
// import axios from 'axios';
// import { useState, useEffect } from 'react';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
// });

// // Simple hook to fetch data
// export const useGetData = <T>() => {
//   const [data, setData] = useState<T | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     api.get<T>('')
//       .then(response => setData(response.data))
//       .catch(err => setError(err))
//       .finally(() => setIsLoading(false));
//   }, []);

//   return { data, error, isLoading };
// };