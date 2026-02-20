// hooks/useRoomTTL.ts
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseRoomTTLProps {
    roomId: string;
    onExpire?: () => void;
}

interface UseRoomTTLReturn {
    timeRemaining: number | null;
    formattedTime: string;
    isExpiring: boolean;
    progress: number | null;
    refreshTTL: () => void;
}

export const useRoomTTL = ({
    roomId,
    onExpire
}: UseRoomTTLProps): UseRoomTTLReturn => {
    const router = useRouter();
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [initialTTL, setInitialTTL] = useState<number | null>(null);

    const { data: ttlData, refetch: refreshTTL } = useQuery({
        queryKey: ["ttl", roomId],
        queryFn: async () => {
            const res = await client.rooms.ttl.get({ query: { roomId } });
            return res.data;
        },
        refetchInterval: 30000,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (ttlData?.ttl !== undefined) {
            setTimeRemaining(ttlData.ttl);
            if (initialTTL === null) {
                setInitialTTL(ttlData.ttl);
            }
        }
    }, [ttlData, initialTTL]);

    useEffect(() => {
        if (timeRemaining === null || timeRemaining < 0) return;

        if (timeRemaining === 0) {
            onExpire?.();
            router.push("/?destroyed=true");
            return;
        }

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining, router, onExpire]);

    const formattedTime = timeRemaining !== null
        ? `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
        : '--:--';

    const isExpiring = timeRemaining !== null && timeRemaining < 60;

    const progress = initialTTL !== null && timeRemaining !== null
        ? (timeRemaining / initialTTL) * 100
        : null;

    return {
        timeRemaining,
        formattedTime,
        isExpiring,
        progress,
        refreshTTL,
    };
};