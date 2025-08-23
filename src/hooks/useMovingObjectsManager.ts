import { useEffect, useRef } from 'react';
import { MovingObject } from '../types/MovingObject';
import { useMovingObjects } from '../contexts/MovingObjectsContext';
import { useResponsiveMovingObjects } from './useResponsiveMovingObjects';
import { useTestingUtilities } from './useTestingUtilities';

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
export function useMovingObjectsManager(testingObjects?: MovingObject[]): UseMovingObjectsManagerReturn {
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
      // Make the first moving objects appear faster, then slow down
      let minInterval: number;
      let maxInterval: number;

      if (movingObjectCount < 2) {
        minInterval = 600; // 0.6s
        maxInterval = 1200; // 1.2s
      } else if (movingObjectCount < 4) {
        minInterval = responsiveConfig.animationInterval.min * 0.6; // Faster initial appearance
        maxInterval = responsiveConfig.animationInterval.max * 0.6;
      } else {
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

  // Restricted areas calculation
  useEffect(() => {
    if (!questionRef.current || !footerRef.current) return;

    function getTextLineRects(container: Element): DOMRect[] {
      const rects: DOMRect[] = [];
      const paragraphs = Array.from(container.querySelectorAll('p'));
      for (const p of paragraphs) {
        const range = document.createRange();
        range.selectNodeContents(p);
        const clientRects = Array.from(range.getClientRects());
        for (const r of clientRects) {
          rects.push(new DOMRect(r.left, r.top, r.width, r.height));
        }
        range.detach?.();
      }
      return rects;
    }

    const questionRects = getTextLineRects(questionRef.current);
    const footerRects = getTextLineRects(footerRef.current);
    const navRects: DOMRect[] = [];
    if (navbarRef.current) {
      const r = navbarRef.current.getBoundingClientRect();
      navRects.push(new DOMRect(r.left, r.top, r.width, r.height));
    }
    setRestrictedAreas([...navRects, ...questionRects, ...footerRects]);
  }, [setRestrictedAreas]);

  return {
    questionRef,
    footerRef,
    navbarRef,
  };
}
