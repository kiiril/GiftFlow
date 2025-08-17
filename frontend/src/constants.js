export const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:8108/api';

export const UPLOADS_BASE_URL = process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:8108';
