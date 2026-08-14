import React, { useEffect, useMemo, useRef } from 'react';
import { useData } from '../../context/DataContext';

const addImage = (images, src) => {
  if (typeof src === 'string' && src.trim()) {
    images.add(src.trim());
  }
};

export const ImagePreloader = () => {
  const { personalInfo, projects, testimonials, dataLoaded } = useData();
  const preloadedImages = useRef(new Set());

  const imageUrls = useMemo(() => {
    const images = new Set();

    addImage(images, personalInfo?.heroImage);
    addImage(images, personalInfo?.aboutImage);

    projects.slice(0, 6).forEach((project) => {
      addImage(images, project.thumbnail);
      addImage(images, project.heroImage);
    });

    testimonials.slice(0, 3).forEach((item) => addImage(images, item.avatar));

    return Array.from(images);
  }, [personalInfo, projects, testimonials]);

  useEffect(() => {
    if (!dataLoaded || imageUrls.length === 0) return;

    const preload = () => {
      imageUrls.forEach((src, index) => {
      if (preloadedImages.current.has(src)) return;
      preloadedImages.current.add(src);

      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = index < 6 ? 'high' : 'low';
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
      });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(preload, 250);
    return () => window.clearTimeout(timerId);
  }, [dataLoaded, imageUrls]);

  return null;
};
