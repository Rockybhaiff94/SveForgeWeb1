import { proxyRequest } from '@/lib/apiClient';

export async function GET(req: Request, props: { params: Promise<{ path?: string[] }> }) {
  const { path } = await props.params;
  const p = path ? path.join('/') : '';
  return proxyRequest(req, `/moderation/${p}`);
}
export async function POST(req: Request, props: { params: Promise<{ path?: string[] }> }) {
  const { path } = await props.params;
  const p = path ? path.join('/') : '';
  return proxyRequest(req, `/moderation/${p}`);
}
export async function PUT(req: Request, props: { params: Promise<{ path?: string[] }> }) {
  const { path } = await props.params;
  const p = path ? path.join('/') : '';
  return proxyRequest(req, `/moderation/${p}`);
}
export async function PATCH(req: Request, props: { params: Promise<{ path?: string[] }> }) {
  const { path } = await props.params;
  const p = path ? path.join('/') : '';
  return proxyRequest(req, `/moderation/${p}`);
}
export async function DELETE(req: Request, props: { params: Promise<{ path?: string[] }> }) {
  const { path } = await props.params;
  const p = path ? path.join('/') : '';
  return proxyRequest(req, `/moderation/${p}`);
}
