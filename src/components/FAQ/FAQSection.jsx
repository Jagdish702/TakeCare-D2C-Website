import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { XCircleIcon, PlusCircleIcon } from './QnAIcons';

/*
  "Question ? Answers" — Figma node 12628:25533 (web "Testimonials" variant,
  12628:25535). Fixed 1440-px canvas scaled to viewport, same transform:scale
  pattern as SubscriptionSection. Each item toggles independently (its own
  Plus/X icon) rather than a single-open accordion — matches the per-item
  icon design and the "click plus opens its answer, click cross returns to
  default" behaviour as specified.
*/

const CANVAS_W = 1440;

function QAItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isOpen ? 16 : 0, alignItems: 'flex-start', width: '100%' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', width: '100%' }}>
        <p
          style={{
            margin: 0,
            flex: '1 0 0',
            minWidth: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 24,
            lineHeight: 'normal',
            color: '#fff',
            letterSpacing: '0.3888px',
          }}
        >
          {item.question}
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
          style={{ display: 'block', flexShrink: 0, width: 24, height: 24, border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
        >
          {isOpen ? <XCircleIcon /> : <PlusCircleIcon />}
        </button>
      </div>
      {isOpen && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', width: '100%', boxSizing: 'border-box' }}>
          <p
            style={{
              margin: 0,
              flex: '1 0 0',
              minWidth: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 16,
              lineHeight: '28px',
              color: '#e5e5e5',
              letterSpacing: '0.5184px',
            }}
          >
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const { faq } = useContent();
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  // Single-open accordion: opening a question closes whichever one was open.
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !canvasRef.current) return;
      const vw = document.documentElement.clientWidth;
      const s = Math.min(1, vw / CANVAS_W);
      const ox = (vw - CANVAS_W * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, 0) scale(${s})`;
      canvasRef.current.style.transformOrigin = 'top left';
      wrapperRef.current.style.height = `${canvasRef.current.scrollHeight * s}px`;
    };
    update();
    window.addEventListener('resize', update);
    // Re-measure whenever an answer opens/closes and changes canvas height.
    const ro = new ResizeObserver(update);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', background: '#000', overflow: 'hidden' }}>
      <div
        ref={canvasRef}
        style={{
          width: CANVAS_W,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 80,
          padding: '120px 360px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 88,
            lineHeight: 'normal',
            whiteSpace: 'nowrap',
          }}
        >
          <p style={{ margin: 0, color: '#808080' }}>{faq.content.heading_line1}</p>
          <p style={{ margin: 0, color: '#fff' }}>{faq.content.heading_line2}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start', width: '100%' }}>
          {faq.items.map((item, i) => (
            <QAItem key={item.question} item={item} isOpen={openIndex === i} onToggle={() => toggle(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
