// Use relative URL in production, absolute URL in development
export const API_BASE_URL = process.env.NODE_ENV === 'prod'
    ? '/api'
    : 'http://localhost:8108/api';

// Separate constant for uploads since they're served from /uploads, not /api
export const UPLOADS_BASE_URL = process.env.NODE_ENV === 'prod'
    ? ''
    : 'http://localhost:8108';
