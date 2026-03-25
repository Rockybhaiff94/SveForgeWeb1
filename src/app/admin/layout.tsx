import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-zinc-900 text-zinc-100 overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminNavbar />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-900/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
