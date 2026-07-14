import React from 'react';
import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ContentProvider } from './context/ContentContext';
import './index.css';

gsap.registerPlugin(ScrollTrigger);
// Touch-scroll momentum (the "fling") can desync GSAP's pinned sections from
// the native scroll position mid-flick, making a pinned frame appear to
// scroll away with the rest of the page instead of staying put while its
// internal content animates. normalizeScroll hands scroll handling to GSAP
// so pins stay locked. Scoped to touch devices — desktop wheel/trackpad
// scrolling doesn't have this failure mode and shouldn't be altered.
if (window.matchMedia('(pointer: coarse)').matches) {
  // allowNestedScroll: without it, normalizeScroll hijacks ALL touch
  // scrolling for the pinned GSAP sections, so nested `overflow:auto`
  // containers (CartDrawerMobile, CheckoutPageMobile, ProfileDashboard,
  // AvailDiscounts' address dropdown, etc.) stop being scrollable on touch.
  ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ContentProvider>
        <App />
      </ContentProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
