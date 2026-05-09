import { useEffect, useState } from 'react';

export default function SiteChrome() {
  const [preloaderLoaded, setPreloaderLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    let loadedTimer;
    let hideTimer;

    const dismissPreloader = () => {
      setPreloaderLoaded(true);
      hideTimer = window.setTimeout(() => {
        setShowPreloader(false);
      }, 600);
    };

    if (document.readyState === 'complete') {
      dismissPreloader();
    } else {
      const onLoad = () => {
        loadedTimer = window.setTimeout(dismissPreloader, 0);
      };

      window.addEventListener('load', onLoad, { once: true });

      return () => {
        window.removeEventListener('load', onLoad);
        if (loadedTimer) window.clearTimeout(loadedTimer);
        if (hideTimer) window.clearTimeout(hideTimer);
      };
    }

    return () => {
      if (loadedTimer) window.clearTimeout(loadedTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {showPreloader && (
        <div id="preloader" className={`preloader${preloaderLoaded ? ' loaded' : ''}`}>
          <div className="animation-preloader">
            <div className="spinner"></div>
            <div className="txt-loading">
              <span data-text-preloader="P" className="letters-loading">P</span>
              <span data-text-preloader="U" className="letters-loading">U</span>
              <span data-text-preloader="L" className="letters-loading">L</span>
              <span data-text-preloader="S" className="letters-loading">S</span>
              <span data-text-preloader="E" className="letters-loading">E</span>
            </div>
            <p className="text-center">Loading</p>
          </div>
          <div className="loader">
            <div className="row">
              <div className="col-3 loader-section section-left"><div className="bg"></div></div>
              <div className="col-3 loader-section section-left"><div className="bg"></div></div>
              <div className="col-3 loader-section section-right"><div className="bg"></div></div>
              <div className="col-3 loader-section section-right"><div className="bg"></div></div>
            </div>
          </div>
        </div>
      )}



      <button id="back-top" className="back-to-top">
        <i className="fa-regular fa-arrow-up"></i>
      </button>

      <div className="mouseCursor cursor-outer"></div>
      <div className="mouseCursor cursor-inner"></div>
    </>
  );
}