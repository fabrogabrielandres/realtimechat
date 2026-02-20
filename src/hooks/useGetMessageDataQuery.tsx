import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';

export const useGetMessageDataQuery = (query: { roomId: string }) => {
    const { roomId } = query
    const { status, data, error, refetch, isLoading, isError } = useQuery({
        queryKey: ["messages", roomId],
        queryFn: async () => {
            const res = await client.messages.get({ query: { roomId } })
            return res.data
        },
        // Importante: evitar refetch automático
        staleTime: Infinity,
        // No refetch en window focus
        refetchOnWindowFocus: false,
    });

    return { status, data, error, refetch, isLoading, isError };
};