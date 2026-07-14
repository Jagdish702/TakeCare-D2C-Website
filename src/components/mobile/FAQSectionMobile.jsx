import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { XCircleIcon, PlusCircleIcon } from '../FAQ/QnAIcons';

/*
  Mobile "Question ? Answers" — Figma node 12628:25545 ("Testimonials_mobile").
  Fluid width (no fixed-canvas scale), same convention as the site's other
  simple mobile sections. Data/icons shared with the desktop FAQSection.
*/

function QAItemMobile({ item, isOpen, onToggle }) {
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
            fontSize: 20,
            lineHeight: '28px',
            color: '#fff',
            letterSpacing: '0.324px',
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
              fontSize: 14,
              lineHeight: '24px',
              color: '#e5e5e5',
              letterSpacing: '0.4536px',
            }}
          >
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQSectionMobile() {
  const { faq } = useContent();
  // Single-open accordion: opening a question closes whichever one was open.
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div
      style={{
        width: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 48,
        padding: '60px 48px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: 24,
          columnGap: 12,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: 48,
          lineHeight: 'normal',
          whiteSpace: 'nowrap',
        }}
      >
        <p style={{ margin: 0, color: '#808080' }}>{faq.content.heading_line1}</p>
        <p style={{ margin: 0, color: '#fff' }}>{faq.content.heading_line2}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start', width: '100%' }}>
        {faq.items.map((item, i) => (
          <QAItemMobile key={item.question} item={item} isOpen={openIndex === i} onToggle={() => toggle(i)} />
        ))}
      </div>
    </div>
  );
}
