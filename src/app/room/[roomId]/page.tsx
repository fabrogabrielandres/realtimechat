'use client';

import { useUsername } from '@/hooks/use-username';
import { useGetMessageDataQuery } from '@/hooks/useGetMessageDataQuery';
import { useMessageMutation } from '@/hooks/useMessageMutation';
import { useRealtime } from '@/lib/realtime-client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/lib/realtime';
import { useRoomTTL } from '@/hooks/useRoomTTL';
import { client } from '@/lib/client';

export default function ComponentName() {
    const params = useParams();
    const roomId = params.roomId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const { username } = useUsername();
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { mutationName } = useMessageMutation();
    const { data: messagesData } = useGetMessageDataQuery({ roomId });

    const [copyStatus, setCopyStatus] = useState("COPY");

    // Custom hook del tiempo - SOLO ESTO SE AGREGA/MANTIENE
    const {
        formattedTime,
        isExpiring,
        progress
    } = useRoomTTL({
        roomId,
        onExpire: () => {
            console.log('Room expired!');
        }
    });

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopyStatus("COPIED!");
        setTimeout(() => setCopyStatus("COPY"), 2000);
    };
    useEffect(() => {
        if (!mutationName.isPending) {
            inputRef.current?.focus();
        }
    }, [mutationName.isPending]);

    const sendMessage = () => {
        if (!input.trim()) return;

        mutationName.mutate({
            username,
            text: input,
            roomId,
            cleanInput: setInput
        });
    };

    // Manejador de tecla Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && input.trim()) {
            // e.preventDefault();
            sendMessage();
        }
    };
    // Realtime updates
    useRealtime({
        channels: [roomId],
        events: ["chat.message", "chat.destroy"],
        onData: ({ event, data }) => {
            if (event === "chat.message") {
                // Actualizar cache de React Query con el mensaje real
                queryClient.setQueryData(["messages", roomId], (old: any) => {
                    // Filtrar mensajes temporales con el mismo texto
                    const filteredMessages = old?.messages?.filter(
                        (m: Message) =>
                            !m.id.startsWith('temp-') ||
                            m.text !== data.text
                    ) || [];

                    // Añadir el mensaje real si no existe ya
                    const exists = filteredMessages.some((m: Message) => m.id === data.id);
                    if (!exists) {
                        return {
                            messages: [...filteredMessages, data]
                        };
                    }

                    return old;
                });
            }

            if (event === "chat.destroy") {
                router.push("/?destroyed=true");
            }
        },
    });

    const destroyRoom = async () => {
        console.log("desde es detroyroom");

        const resp = await client.rooms.delete(null, { query: { roomId } })

        console.log("resp", resp);

    }

    // Obtener mensajes del cache
    const messages = messagesData?.messages || [];

    return (
        <main className="flex flex-col h-screen max-h-screen overflow-hidden">
            {/* Header */}
            <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 uppercase">Room ID</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-green-500 truncate">
                                {roomId.slice(0, 10)}...
                            </span>
                            <button
                                onClick={copyLink}
                                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                                {copyStatus}
                            </button>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-zinc-800" />

                    {/* SECCIÓN DEL TIEMPO - Solo esto se modifica para usar el hook */}
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 uppercase">Self-Destruct</span>
                        <span
                            className={`text-sm font-bold flex items-center gap-2 ${formattedTime !== null && parseInt(formattedTime.split(':')[1]) < 60
                                ? "text-red-500"
                                : "text-amber-500"
                                }`}
                        >
                            {formattedTime !== null ? formattedTime : "--:--"}
                            {/* Barra de progreso opcional si el hook la provee */}
                            {progress !== null && (
                                <span className="text-xs text-zinc-600">
                                    ({Math.round(progress)}%)
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                <button
                    className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50"
                    onClick={() => destroyRoom()}
                >
                    <span className="group-hover:animate-pulse">💣</span>
                    DESTROY NOW
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-600 text-sm font-mono">
                            No messages yet, start the conversation.
                        </p>
                    </div>
                )}

                {messages.map((msg: Message) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col items-start ${msg.id.startsWith('temp-') ? 'opacity-50' : ''
                            }`}
                    >
                        <div className="max-w-[80%] group">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span
                                    className={`text-xs font-bold ${msg.sender === username
                                        ? "text-green-500"
                                        : "text-blue-500"
                                        }`}
                                >
                                    {msg.sender === username ? "YOU" : msg.sender}
                                    {msg.id.startsWith('temp-') && " (sending...)"}
                                </span>

                                <span className="text-[10px] text-zinc-600">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>

                            <p className="text-sm text-zinc-300 leading-relaxed break-all">
                                {msg.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
                <div className="flex gap-4">
                    <div className="flex-1 relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
                            {">"}
                        </span>
                        <input
                            ref={inputRef}
                            autoFocus
                            type="text"
                            value={input}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type message..."
                            disabled={mutationName.isPending}
                            className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm disabled:opacity-50"
                        />
                    </div>

                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || mutationName.isPending}
                        className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        SEND
                    </button>
                </div>
            </div>
        </main>
    );
}