import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { showLoading } from '@/lib/store/loadingSlice';

export function useLoadingRouter() {
  const router = useRouter();
  const dispatch = useDispatch();

  const push = (href: string, options?: any) => {
    dispatch(showLoading());
    router.push(href, options);
  };

  const replace = (href: string, options?: any) => {
    dispatch(showLoading());
    router.replace(href, options);
  };

  const back = () => {
    dispatch(showLoading());
    router.back();
  };

  const forward = () => {
    dispatch(showLoading());
    router.forward();
  };

  const refresh = () => {
    dispatch(showLoading());
    router.refresh();
  };

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    prefetch: router.prefetch,
  };
}