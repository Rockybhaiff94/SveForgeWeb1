import { proxyRequest } from '@/lib/apiClient';

export async function GET(req: Request) { return proxyRequest(req, '/feature-flags'); }
export async function POST(req: Request) { return proxyRequest(req, '/feature-flags'); }
export async function PUT(req: Request) { return proxyRequest(req, '/feature-flags'); }
export async function PATCH(req: Request) { return proxyRequest(req, '/feature-flags'); }
