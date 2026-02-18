import { client } from '@/lib/client';
import { useMutation, } from '@tanstack/react-query';


interface TMutationVariables {
    username: string, text: string, roomId: string, cleanInput: (resetValue: string) => void
}


export const useMessageMutation = () => {
    const mutationName = useMutation({
        mutationFn: async ({ username, text, roomId, cleanInput }: TMutationVariables) => {
            await client.messages.post({ sender: username, text }, { query: { roomId } })
            return "hola"
        },
        onMutate: ({ cleanInput, roomId, text, username }) => {
            cleanInput("")
        },
        onError: (error, { cleanInput, text }, context) => {
            cleanInput(text)
        },
        onSuccess: (data, { cleanInput, text, username }, context) => {
            cleanInput("")            
        }

    });
    return { mutationName }
}

