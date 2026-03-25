import { NextResponse } from 'next/server';
import { proxyRequest } from '@/lib/apiClient';

export async function GET(req: Request) {
  // Pass the request to the real backend to validate the token
  // The backend should return the user profile OR 401 if invalid/version changed
  return proxyRequest(req, '/auth/me');
}
