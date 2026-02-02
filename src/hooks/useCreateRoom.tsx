import { client } from "@/lib/client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateRoom = () => {
  const router = useRouter()
  const asyncFuntion = async () => {
    const res = await client.rooms.create.post()
    if (res.status === 200) {
      router.push(`/room/${res.data?.roomId}`)
    }
  };

  const createRoom = useMutation({
    mutationFn: async () => {
      await asyncFuntion();
    },
  });


  return {
    createRoom
  };
};

