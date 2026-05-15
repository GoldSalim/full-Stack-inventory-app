import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getStats().then(res => res.data),
    refetchInterval: 30000,
  });
};