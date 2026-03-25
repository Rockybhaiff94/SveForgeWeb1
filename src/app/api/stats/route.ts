import { proxyRequest } from '@/lib/apiClient';

export async function GET(req: Request) { return proxyRequest(req, '/stats'); }
