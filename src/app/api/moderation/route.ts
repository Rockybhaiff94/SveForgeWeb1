import { proxyRequest } from '@/lib/apiClient';

export async function GET(req: Request) { return proxyRequest(req, '/moderation'); }
export async function POST(req: Request) { return proxyRequest(req, '/moderation'); }
