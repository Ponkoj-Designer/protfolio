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
    addImage(images, personalInfo?.adminAvatar);

    projects.forEach((project) => {
      addImage(images, project.thumbnail);
      addImage(images, project.heroImage);
      (project.gallery || []).forEach((src) => addImage(images, src));
    });

    testimonials.forEach((item) => addImage(images, item.avatar));

    return Array.from(images);
  }, [personalInfo, projects, testimonials]);

  useEffect(() => {
    if (!dataLoaded || imageUrls.length === 0) return;

    imageUrls.forEach((src, index) => {
      if (preloadedImages.current.has(src)) return;
      preloadedImages.current.add(src);

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = index < 6 ? 'high' : 'low';
      document.head.appendChild(link);

      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = index < 6 ? 'high' : 'low';
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, [dataLoaded, imageUrls]);

  return null;
};
