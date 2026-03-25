import { proxyRequest } from '@/lib/apiClient';

export async function GET(req: Request) { return proxyRequest(req, '/servers'); }
export async function POST(req: Request) { return proxyRequest(req, '/servers'); }
export async function PUT(req: Request) { return proxyRequest(req, '/servers'); }
export async function PATCH(req: Request) { return proxyRequest(req, '/servers'); }
export async function DELETE(req: Request) { return proxyRequest(req, '/servers'); }
