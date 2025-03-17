import axios from 'axios';

const SUPABASE_API_URL = 'https://api.supabase.com/v1';

export const supabaseApiClient = (token: string) => {
  const instance = axios.create({
    baseURL: SUPABASE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return instance;
};
