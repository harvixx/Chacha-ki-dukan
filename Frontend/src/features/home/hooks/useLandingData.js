import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getSellers, getLeaderboard } from '../../../api/axios.api';

/**
 * useLandingData — FSD hook encapsulating all data-fetching for LandingPage.
 *
 * Sellers require authentication (backend authMiddleware).
 * Leaderboard is public.
 */
export const useLandingData = () => {
  const { isAuth } = useSelector((state) => state.auth);

  const {
    data: sellers = [],
    isLoading: sellersLoading,
    isError: sellersError,
  } = useQuery({
    queryKey: ['landing-sellers'],
    queryFn: getSellers,
    // Only fire the request when the user is authenticated
    enabled: !!isAuth,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
  });

  const {
    data: lbData,
    isLoading: lbLoading,
  } = useQuery({
    queryKey: ['landing-leaderboard'],
    queryFn: getLeaderboard,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
  });

  // Slice the top 3 entries for the testimonial section
  const topPlayers = (lbData?.leaderboard ?? []).slice(0, 3);

  return {
    // Sellers
    sellers,
    sellersLoading: !!isAuth && sellersLoading,
    sellersError,
    isAuth,
    topPlayers,
    lbLoading,
  };
};
