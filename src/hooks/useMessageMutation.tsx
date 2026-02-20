import { client } from '@/lib/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    roomId: string;
}

interface TMutationVariables {
    username: string;
    text: string;
    roomId: string;
    cleanInput: (resetValue: string) => void;
}

export const useMessageMutation = () => {
    const queryClient = useQueryClient();
    
    const mutationName = useMutation({
        mutationFn: async ({ username, text, roomId }: TMutationVariables) => {
            await client.messages.post(
                { sender: username, text }, 
                { query: { roomId } }
            );
        },
        
        // Optimistic update
        onMutate: async ({ username, text, roomId, cleanInput }) => {
            // Cancelar queries salientes
            await queryClient.cancelQueries({ queryKey: ["messages", roomId] });
            
            // Guardar mensajes actuales
            const previousMessages = queryClient.getQueryData(["messages", roomId]);
            
            // Crear mensaje temporal
            const tempMessage: Message = {
                id: `temp-${Date.now()}`,
                sender: username,
                text,
                timestamp: Date.now(),
                roomId,
            };
            
            // Actualizar caché optimísticamente
            queryClient.setQueryData(["messages", roomId], (old: any) => ({
                messages: [...(old?.messages || []), tempMessage]
            }));
            
            // Limpiar input
            cleanInput("");
            
            // Retornar contexto para posible rollback
            return { previousMessages, tempMessage };
        },
        
        // Si la mutación falla, revertir
        onError: (error, { text, roomId, cleanInput }, context) => {
            // Revertir a mensajes anteriores
            if (context?.previousMessages) {
                queryClient.setQueryData(
                    ["messages", roomId], 
                    context.previousMessages
                );
            }
            
            // Restaurar input
            cleanInput(text);
            
            console.error("Error sending message:", error);
        },
        
        // No hacer nada en success - confiar en realtime
        onSuccess: (data, { cleanInput }) => {
            // El input ya está limpio por onMutate
            // No invalidamos query porque realtime la actualizará
        },
        
        // Siempre ejecutar después de la mutación (éxito o error)
        onSettled: (data, error, { roomId }) => {
            // Pequeño timeout por si realtime falla
            setTimeout(() => {
                queryClient.invalidateQueries({ 
                    queryKey: ["messages", roomId],
                    // Solo si no hay mensajes nuevos aún
                });
            }, 2000);
        }
    });
    
    return { mutationName };
};