"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/lib/store/loadingSlice';

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch(hideLoading());
  }, [pathname, searchParams, dispatch]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const currentUrl = window.location.href;
        const targetUrl = link.href;
        
        if (targetUrl.startsWith(window.location.origin) && targetUrl !== currentUrl) {
          if (!link.target || link.target === '_self') {
            dispatch(showLoading());
            
            timeoutRef.current = setTimeout(() => {
              dispatch(hideLoading());
            }, 10000);
          }
        }
      }
    };

    // 뒒로가기/앞으로가기 감지
    const handlePopState = () => {
      dispatch(showLoading());
      
      timeoutRef.current = setTimeout(() => {
        dispatch(hideLoading());
      }, 10000);
    };

    // 폼 제출 감지 (페이지 이동이 일어날 수 있는 경우)
    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const method = form.method.toLowerCase();
      const action = form.action;
      
      // GET 메소드이거나 다른 페이지로 이동하는 경우
      if (method === 'get' || (action && action !== window.location.href)) {
        dispatch(showLoading());
        
        timeoutRef.current = setTimeout(() => {
          dispatch(hideLoading());
        }, 10000);
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('submit', handleFormSubmit);

    return () => {
      // 클린업
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('submit', handleFormSubmit);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dispatch]);

  return null;
}