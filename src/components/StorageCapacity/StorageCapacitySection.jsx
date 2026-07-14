import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CANVAS_W = 1440;
const CANVAS_H = 1100;
const OUTER_H  = '300vh';

const PRODUCT_IMG = '/assets/storage-capacity/product-1.png';
const IMG_W = 979;
const IMG_H = 1332;
const IMG_X = 651;                      // 180(pad) + 411(text-col) + 60(gap)
const IMG_Y = (CANVAS_H - IMG_H) / 2;  // -116 — overflows top+bottom, clipped

const SLIDE_IN = 500; // canvas-px the image starts to the right of its resting spot

function Stat({ number, unit, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
        <span
          className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
          style={{ fontSize: 88, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#000', lineHeight: 1 }}
        >
          {number}
        </span>
        <span
          className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
          style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#999999', letterSpacing: '0.5184px', lineHeight: '28px', paddingBottom: 10 }}
        >
          {unit}
        </span>
      </div>
      <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.12)' }} />
      <span
        className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
        style={{ fontSize: 16, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#30956A', letterSpacing: '0.5184px', lineHeight: '28px', textAlign: 'center' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function StorageCapacitySection() {
  const outerRef  = useRef(null);
  const canvasRef = useRef(null);
  const leftRef   = useRef(null);
  const imgRef    = useRef(null);

  useEffect(() => {
    if (leftRef.current) leftRef.current.style.opacity = '0';

    const updateScale = () => {
      if (!canvasRef.current) return;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const s  = Math.min(1, vw / CANVAS_W, (vh - 52) / CANVAS_H);
      const ox = (vw - CANVAS_W * s) / 2;
      const oy = 52 + ((vh - 52) - CANVAS_H * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    };
    updateScale();
    const raf = requestAnimationFrame(updateScale);
    window.addEventListener('resize', updateScale);

    const ctx = gsap.context(() => {
      if (!leftRef.current || !imgRef.current || !outerRef.current) return;

      gsap.set(leftRef.current, { opacity: 0 });
      gsap.set(imgRef.current,  { x: SLIDE_IN });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   1.5,
        },
      });

      // Beat 0→2: text fades in, product image slides left into position
      tl.to(leftRef.current, { opacity: 1, duration: 2, ease: 'none' }, 0);
      tl.to(imgRef.current,  { x: 0,       duration: 2, ease: 'power2.out' }, 0);
      // Beat 2→4: both hold at final position
    }, outerRef);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateScale);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={outerRef} style={{ height: OUTER_H }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#fff' }}>
        <div
          ref={canvasRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: CANVAS_W, height: CANVAS_H,
            transformOrigin: '0 0',
            overflow: 'hidden',
          }}
        >
          {/* Left column — outer div vertically centres content; only inner div has GSAP opacity */}
          <div style={{ position: 'absolute', left: 180, top: 0, bottom: 0, width: 411, display: 'flex', alignItems: 'center' }}>
            <div ref={leftRef} style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>

              {/* Text block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                <h2
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 48, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', lineHeight: 1, margin: 0 }}
                >
                  Flexible Storage Capacity
                </h2>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#4D4D4D', letterSpacing: '0.5825px', lineHeight: '28px', margin: 0 }}
                >
                  Six compartments are sized for routine medication schedules, while the two larger compartments offer up to three times the storage capacity — ideal for higher-volume medications, larger tablets, or extended dosing needs.
                </p>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
                <Stat number="24" unit="mm Height" label="6 compartments" />
                <Stat number="48" unit="mm height" label="2 compartments" />
              </div>

            </div>
          </div>

          {/* Right product image — slides in from the right on scroll */}
          <div
            ref={imgRef}
            style={{ position: 'absolute', left: IMG_X, top: IMG_Y, width: IMG_W, height: IMG_H }}
          >
            <img
              src={PRODUCT_IMG}
              alt="TakeCare device storage compartments"
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
