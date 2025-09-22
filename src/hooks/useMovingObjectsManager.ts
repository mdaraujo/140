import { useCallback, useEffect, useRef } from 'react';
import { MovingObject } from '../types/MovingObject';
import { useMovingObjects } from '../contexts/MovingObjectsContext';
import { useResponsiveMovingObjects } from './useResponsiveMovingObjects';
import { useTestingUtilities } from './useTestingUtilities';
import { isPositionDebugEnabled } from '../utils/debug';

/**
 * Return type for useMovingObjectsManager hook
 */
interface UseMovingObjectsManagerReturn {
  // Refs for components that need them
  questionRef: React.RefObject<HTMLDivElement>;
  footerRef: React.RefObject<HTMLElement>;
  navbarRef: React.RefObject<HTMLElement>;
}

/**
 * Consolidated hook that manages all moving objects business logic
 * Combines object spawning, responsive behavior, and testing utilities
 */
export function useMovingObjectsManager(
  testingObjects?: MovingObject[],
): UseMovingObjectsManagerReturn {
  const {
    movingObjectCount,
    setMovingObjectCount,
    setRestrictedAreas,
    setResponsiveConfig,
    getRandomPickCounts,
  } = useMovingObjects();

  // Refs for restricted area calculation
  const questionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  // Get responsive configuration
  const responsiveConfig = useResponsiveMovingObjects();

  // Set up testing utilities (only in dev)
  useTestingUtilities(testingObjects || [], { current: getRandomPickCounts() });

  // Update responsive config in context when it changes
  useEffect(() => {
    setResponsiveConfig(responsiveConfig);
  }, [responsiveConfig, setResponsiveConfig]);

  // Object spawning logic (consolidated from useObjectSpawning)
  useEffect(() => {
    if (movingObjectCount < responsiveConfig.maxMovingObjects) {
      // Early spawns (faster than normal)
      let minInterval: number;
      let maxInterval: number;

      if (movingObjectCount < 2) {
        // First 1–2 spawns at ~30% of normal interval
        minInterval = responsiveConfig.animationInterval.min * 0.3;
        maxInterval = responsiveConfig.animationInterval.max * 0.3;
      } else if (movingObjectCount < 4) {
        // Next couple spawns at ~60% of normal interval
        minInterval = responsiveConfig.animationInterval.min * 0.6;
        maxInterval = responsiveConfig.animationInterval.max * 0.6;
      } else {
        // Afterwards use normal interval
        minInterval = responsiveConfig.animationInterval.min;
        maxInterval = responsiveConfig.animationInterval.max;
      }

      const interval = setInterval(
        () => {
          setMovingObjectCount(Math.min(movingObjectCount + 1, responsiveConfig.maxMovingObjects));
        },
        Math.random() * (maxInterval - minInterval) + minInterval,
      );

      return () => clearInterval(interval);
    }
  }, [movingObjectCount, responsiveConfig, setMovingObjectCount]);

  // Compute and subscribe to restricted areas changes (resize, DOM changes)
  const computeAndSetRestrictedAreas = useCallback(() => {
    const refsReady = Boolean(questionRef.current) && Boolean(footerRef.current);
    if (!refsReady) {
      // Retry on next frame if some refs haven't mounted yet during route/theme changes
      if (isPositionDebugEnabled()) {
        console.log('[restricted] refs not ready; scheduling recompute');
      }
      requestAnimationFrame(() => computeAndSetRestrictedAreas());
    }

    function getTextLineRects(container: Element): DOMRect[] {
      const rects: DOMRect[] = [];
      const paragraphs = Array.from(container.querySelectorAll('p'));
      for (const p of paragraphs) {
        const range = document.createRange();
        range.selectNodeContents(p);
        const clientRects = Array.from(range.getClientRects());
        for (const r of clientRects) rects.push(new DOMRect(r.left, r.top, r.width, r.height));
        range.detach?.();
      }
      return rects;
    }

    const questionRects = questionRef.current ? getTextLineRects(questionRef.current) : [];
    const footerRects = footerRef.current ? getTextLineRects(footerRef.current) : [];
    const navRects: DOMRect[] = [];
    if (navbarRef.current) {
      const r = navbarRef.current.getBoundingClientRect();
      navRects.push(new DOMRect(r.left, r.top, r.width, r.height));
    }
    const bubbleRects: DOMRect[] = [];
    const bubble = questionRef.current?.querySelector('.answer-bubble') as HTMLElement | null;
    if (bubble) {
      const r = bubble.getBoundingClientRect();
      bubbleRects.push(new DOMRect(r.left, r.top, r.width, r.height));
    }
    const allRects = [...navRects, ...questionRects, ...bubbleRects, ...footerRects];

    if (isPositionDebugEnabled()) {
      function previewRects(rects: DOMRect[]) {
        return rects.slice(0, 3).map((a) => ({
          top: Math.round(a.top),
          left: Math.round(a.left),
          width: Math.round(a.width),
          height: Math.round(a.height),
        }));
      }

      console.log('[restricted] computed', {
        navCount: navRects.length,
        questionCount: questionRects.length,
        bubbleCount: bubbleRects.length,
        footerCount: footerRects.length,
        total: allRects.length,
        navPreview: previewRects(navRects),
        questionPreview: previewRects(questionRects),
        bubblePreview: previewRects(bubbleRects),
        footerPreview: previewRects(footerRects),
      });
    }

    setRestrictedAreas(allRects);
  }, [setRestrictedAreas]);

  useEffect(() => {
    // Initial compute twice (layout settle)
    computeAndSetRestrictedAreas();
    requestAnimationFrame(computeAndSetRestrictedAreas);

    // React to window changes
    window.addEventListener('resize', computeAndSetRestrictedAreas);
    window.addEventListener('scroll', computeAndSetRestrictedAreas, true);

    // Observe element resizes and DOM mutations (e.g., answer bubble mounts/changes)
    const resizeObserver = new ResizeObserver(() => computeAndSetRestrictedAreas());
    if (questionRef.current) resizeObserver.observe(questionRef.current);
    if (footerRef.current) resizeObserver.observe(footerRef.current);
    if (navbarRef.current) resizeObserver.observe(navbarRef.current);
    const bubble = questionRef.current?.querySelector('.answer-bubble') as HTMLElement | null;
    if (bubble) resizeObserver.observe(bubble);

    const mutationObserver = new MutationObserver(() => computeAndSetRestrictedAreas());
    if (questionRef.current) {
      mutationObserver.observe(questionRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
    }

    // Also observe global theme/page class changes to recompute when layout metrics shift
    const htmlObserver = new MutationObserver(() => computeAndSetRestrictedAreas());
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', computeAndSetRestrictedAreas);
      window.removeEventListener('scroll', computeAndSetRestrictedAreas, true);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      htmlObserver.disconnect();
    };
  }, [computeAndSetRestrictedAreas]);

  return {
    questionRef,
    footerRef,
    navbarRef,
  };
}
