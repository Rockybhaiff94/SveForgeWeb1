export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
                <p className="text-sm text-zinc-400 mt-1">Configure global application preferences.</p>
            </div>

            <div className="space-y-6">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">General Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="platform-name" className="block text-sm font-medium text-zinc-300 mb-1">Platform Name</label>
                            <input id="platform-name" type="text" defaultValue="ServerForge" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="support-email" className="block text-sm font-medium text-zinc-300 mb-1">Support Email</label>
                            <input id="support-email" type="email" defaultValue="support@serverforge.test" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Security Defaults</h2>
                    <div className="flex items-center justify-between p-4 border border-zinc-800/50 bg-zinc-900 rounded-lg">
                        <div>
                            <p className="font-medium text-zinc-200">Require 2FA for Admins</p>
                            <p className="text-sm text-zinc-500">Enforce multi-factor authentication for all DEV, ADMIN, and OWNER roles.</p>
                        </div>
                        <label htmlFor="require-2fa" className="relative inline-flex items-center cursor-pointer">
                            <input id="require-2fa" type="checkbox" aria-label="Require 2FA for Admins" className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">Cancel</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">Save Settings</button>
                </div>
            </div>
        </div>
    );
}
