import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth-util";
import { PlusCircle, Info } from "lucide-react";
import { DashboardServerList } from "@/components/dashboard/DashboardServerList";

export default async function ServersPage() {
    const user = await getSessionUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">My Servers</h1>
                    <p className="text-gray-400 mt-1">Manage all your registered game servers in one place.</p>
                </div>
                <Link href="/add">
                    <button className="px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 text-sm">
                        <PlusCircle className="w-4 h-4" /> Add New Server
                    </button>
                </Link>
            </div>

            <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white mb-1">Managing your servers</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        You can bump each server once every 24 hours to move it to the top of the listings. Premium servers get priority search results and advanced analytics.
                    </p>
                </div>
            </div>

            <DashboardServerList />
        </div>
    );
}
