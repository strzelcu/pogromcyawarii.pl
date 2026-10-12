'use client';
import { useRef, useState } from 'react';
import { galleryPhotos } from '@/lib/gallery';
const heroPhotos = [
  {
    src: '/assets/images/IMG_20181201_202459-scaled.jpg',
    alt: 'Wnętrze komputera podczas pracy serwisowej',
  },
  {
    src: '/assets/images/IMG_20180831_191557-scaled.jpg',
    alt: 'Czyszczenie układu chłodzenia laptopa',
  },
  {
    src: '/assets/images/20160229_155340-scaled.jpg',
    alt: 'Podzespoły komputerowe na stanowisku serwisowym',
  },
];
export function HeroPhotos() {
  const slides = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  function move(step: number) {
    const element = slides.current;
    if (!element) return;
    const next = (index + step + heroPhotos.length) % heroPhotos.length;
    element.scrollTo({
      left: next * element.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }
  return (
    <div className="hero-visual">
      <div
        className="slides"
        ref={slides}
        id="slides"
        aria-label="Zdjęcia z naszego serwisu"
        tabIndex={0}
        onScroll={(e) =>
          setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
        }
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            move(e.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        {heroPhotos.map((photo, i) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <div className="visual-caption">
        <span>Technologia w dobrych rękach</span>
        <div className="slide-controls">
          <span aria-live="polite">{String(index + 1).padStart(2, '0')} / 03</span>
          <button
            type="button"
            aria-controls="slides"
            aria-label="Poprzedni slajd"
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-controls="slides"
            aria-label="Następny slajd"
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
export function Gallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const [index, setIndex] = useState(0);
  function move(step: number) {
    setIndex((i) => (i + step + galleryPhotos.length) % galleryPhotos.length);
  }
  const photo = galleryPhotos[index];
  return (
    <>
      <div className="gallery">
        {galleryPhotos.map((photo, i) => (
          <a
            key={photo.full}
            href={photo.full}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || !dialog.current) return;
              e.preventDefault();
              trigger.current = e.currentTarget;
              setIndex(i);
              dialog.current.showModal();
            }}
          >
            <img loading="lazy" src={photo.thumb} alt={photo.alt} />
          </a>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="lightbox-title"
        onClose={() => trigger.current?.focus()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            move(e.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        <div className="lightbox-toolbar">
          <span id="lightbox-title">{photo?.alt}</span>
          <button
            type="button"
            aria-label="Zamknij zdjęcie"
            onClick={() => dialog.current?.close()}
          >
            ✕
          </button>
        </div>
        {photo && <img id="lightbox-image" src={photo.full} alt={photo.alt} />}
        <div className="lightbox-controls">
          <button type="button" aria-label="Poprzednie zdjęcie" onClick={() => move(-1)}>
            ←
          </button>
          <span aria-live="polite">
            {index + 1} / {galleryPhotos.length}
          </span>
          <button type="button" aria-label="Następne zdjęcie" onClick={() => move(1)}>
            →
          </button>
        </div>
      </dialog>
    </>
  );
}
