import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/auth/services/userService";
import { useUserStore } from "../stores/useUserStore";

export const useUserInfo = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => userService.getUser(),
    staleTime: 0,
    gcTime: 0,
    enabled: isAuthenticated,
    retry: false,
  });
};
