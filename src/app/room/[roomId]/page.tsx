
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ComponentName() {
    const params = useParams();
    const roomId = params.roomId as string;



    const [copyStatus, setCopyStatus] = useState("COPY")



    const copyLink = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        setCopyStatus("COPIED!")
        setTimeout(() => setCopyStatus("COPY"), 2000)
    }



    return (
        <main className="flex flex-col h-screen max-h-screen overflow-hidden">
            <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 uppercase">Room ID</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-green-500 truncate">{roomId.slice(0, 10) + "..."}</span>
                            <button
                                onClick={copyLink}
                                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                                {copyStatus}
                            </button>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-zinc-800" />

                </div>

                <button
                    className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
                >
                    <span className="group-hover:animate-pulse">💣</span>
                    DESTROY NOW
                </button>
            </header>


        </main>
    );
}

