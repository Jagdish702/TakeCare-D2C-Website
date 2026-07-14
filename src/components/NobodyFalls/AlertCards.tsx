import { useRef, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

/*
  Cards are positioned in VIEWPORT space (not canvas space) so they always
  fit within the sticky 100vh frame regardless of viewport size.

  Pop order: right (Command Centre) → middle (Caregiver) → left (Patient)

  Layout:
  - Scale = min(vw/1440, vh/900, 1.0)          ← matches Figma design at 1440×900
  - Three cards in a row, centred horizontally
  - Bottom edge of the card group sits at 96% of viewport height
*/

const FIGMA_GAP    = 80;   // gap between card columns in Figma
const FIGMA_REF_W  = 1440; // Figma design frame width

/* Natural card-column height: card box (~300 px) + 12 px gap + 22 px label */
const FIGMA_COL_H  = 334;

/* Cards in VISUAL order (left → middle → right matching Figma layout).
   Delays drive pop sequence: right pops first (0 ms), middle second (200 ms),
   left last (400 ms). */
export interface CardDef {
  key: string;
  label: string;
  figmaW: number;
  delay: number;
  titleMultiline?: boolean;
  title: string;
  subtitle: string;
  body: string;
  primaryBtn: string;
  primaryIcon: boolean;
  iconStroke?: string;
  secondaryBtn: string;
  secondaryColor?: string;
}

// DB-backed alert card copy — shape returned by GET /api/content (nobodyFalls.alertCards).
export interface AlertCardContent {
  card_key: string;
  label: string;
  title: string;
  subtitle: string;
  body: string;
  primary_button_label: string;
  secondary_button_label: string;
  sort_order: number;
}

// Styling/layout-only — NOT part of the DB content, keyed by card_key so it
// switches on the same literal keys the DB uses ('patient' / 'caregiver' /
// 'command-centre'). Card widths are NOT uniform in Figma — 317 / 340 / 344 px.
const CARD_STYLES: Record<
  string,
  { figmaW: number; delay: number; titleMultiline?: boolean; primaryIcon: boolean; iconStroke?: string; secondaryColor?: string }
> = {
  /* LEFT — Patient — pops last (400 ms) */
  patient: {
    figmaW: 317,
    delay: 400,
    titleMultiline: true,
    primaryIcon: false,
  },
  /* MIDDLE — Caregiver — pops second (200 ms) */
  caregiver: {
    figmaW: 340,
    delay: 200,
    titleMultiline: true,
    primaryIcon: true,
    iconStroke: '#e5e5e5',
    secondaryColor: '#e5e5e5',
  },
  /* RIGHT — Command Centre — pops first (0 ms) */
  'command-centre': {
    figmaW: 344,
    delay: 0,
    primaryIcon: true,
    iconStroke: '#fff',
  },
};

// Merges DB copy (alertCards) with the positional styling above, sorted by
// sort_order (patient, caregiver, command-centre — same left→right/pop order
// the static CARDS array used to hardcode). Exported so the mobile section
// (NobodyFallsMobile) builds the exact same cards from its own useContent().
export function buildCards(alertCards: AlertCardContent[]): CardDef[] {
  return [...alertCards]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => {
      const style = CARD_STYLES[c.card_key];
      return {
        key: c.card_key,
        label: c.label,
        figmaW: style.figmaW,
        delay: style.delay,
        titleMultiline: style.titleMultiline,
        title: c.title,
        subtitle: c.subtitle,
        body: c.body,
        primaryBtn: c.primary_button_label,
        primaryIcon: style.primaryIcon,
        iconStroke: style.iconStroke,
        secondaryBtn: c.secondary_button_label,
        secondaryColor: style.secondaryColor,
      };
    });
}

interface Props {
  visible: boolean;
  vpSize: { w: number; h: number };
}

export default function AlertCards({ visible, vpSize }: Props) {
  const { nobodyFalls } = useContent();
  const CARDS = buildCards(nobodyFalls.alertCards);

  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const { w: vw, h: vh } = vpSize;

    /*
      Two-pass scale calculation:
      1. Width pass: scale so full row fits the viewport width at Figma proportions.
      2. Height pass: the top of the card group must clear the headline text block
         (which ends at roughly 56 % of vh at 1280×600). We give the cards the
         remaining space down to 96 % of vh, then reduce scale if needed.
    */
    const scaleByW   = vw / FIGMA_REF_W;          // width-constrained scale
    const pass1Scale = Math.min(scaleByW, 1.0);

    /* Min top = 56 % vh so cards never overlap the "Nobody falls…" text block */
    const MIN_TOP_FRAC = 0.56;
    const colH1   = FIGMA_COL_H * pass1Scale;
    const top1    = Math.max(vh * MIN_TOP_FRAC, vh * 0.96 - colH1);
    const availH  = vh * 0.96 - top1;
    const scaleByH = availH / FIGMA_COL_H;

    const scale     = Math.min(scaleByW, scaleByH, 1.0);
    const scaledColH = FIGMA_COL_H * scale;

    /* Final groupTop: push cards below the text, anchored to 96 % of vh */
    const groupTop = Math.max(vh * MIN_TOP_FRAC, vh * 0.96 - scaledColH);

    /* Cards are NOT equal width in Figma → total = sum(figmaW) + 2 × gap */
    const naturalTotal = CARDS.reduce((sum, c) => sum + c.figmaW, 0) + FIGMA_GAP * 2;
    const scaledTotal  = naturalTotal * scale;
    const groupLeft    = (vw - scaledTotal) / 2;

    let cursorX = groupLeft;
    CARDS.forEach((card, i) => {
      const el = outerRefs.current[i];
      if (!el) return;
      el.style.left      = `${cursorX}px`;
      el.style.top       = `${groupTop}px`;
      el.style.transform = `scale(${scale})`;
      cursorX += (card.figmaW + FIGMA_GAP) * scale;
    });
  }, [vpSize]);

  return (
    <>
      {CARDS.map((card, i) => (
        <div
          key={card.key}
          ref={(el) => { outerRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            transformOrigin: 'top left',
            width: card.figmaW,
          }}
        >
          {/* Animation wrapper */}
          <div
            style={{
              width: card.figmaW,
              transformOrigin: 'bottom center',
              animation: visible
                ? `nf-card-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) ${card.delay}ms both`
                : 'none',
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.35))',
            }}
          >
            <CardBox card={card} />

            {/* Label below the card — white bold text from Figma */}
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: '#fff',
                textAlign: 'center',
                margin: 0,
                width: '100%',
                letterSpacing: 0.26,
                lineHeight: 'normal',
              }}
            >
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Single card box — pixel-perfect Figma values ─────────────────── */
function PhoneIcon({ stroke = '#E5E5E5' }: { stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M13.9104 6.56394C14.6586 6.70991 15.3462 7.07582 15.8852 7.61483C16.4242 8.15383 16.7901 8.84142 16.9361 9.58959M13.9104 3.5C15.4648 3.67268 16.9143 4.36876 18.0209 5.47395C19.1275 6.57914 19.8254 8.02775 20 9.58193M19.234 15.6945V17.9925C19.2349 18.2058 19.1912 18.4169 19.1057 18.6124C19.0203 18.8079 18.8949 18.9833 18.7377 19.1275C18.5805 19.2718 18.3949 19.3816 18.1928 19.4499C17.9908 19.5182 17.7766 19.5436 17.5642 19.5244C15.2071 19.2683 12.943 18.4629 10.9537 17.1728C9.10295 15.9968 7.53384 14.4277 6.35779 12.5769C5.06326 10.5786 4.25765 8.30349 4.00622 5.93583C3.98708 5.72401 4.01225 5.51053 4.08014 5.30897C4.14802 5.10741 4.25713 4.9222 4.40052 4.76512C4.54391 4.60804 4.71843 4.48254 4.91298 4.3966C5.10753 4.31067 5.31785 4.26619 5.53053 4.26599H7.82849C8.20022 4.26233 8.56061 4.39397 8.84247 4.63636C9.12433 4.87876 9.30843 5.21538 9.36046 5.58348C9.45745 6.31888 9.63732 7.04094 9.89665 7.7359C9.99971 8.01007 10.022 8.30803 9.96092 8.59448C9.89983 8.88093 9.7579 9.14387 9.55195 9.35213L8.57915 10.3249C9.66958 12.2426 11.2574 13.8304 13.1751 14.9208L14.1479 13.948C14.3561 13.7421 14.6191 13.6002 14.9055 13.5391C15.192 13.478 15.4899 13.5003 15.7641 13.6034C16.4591 13.8627 17.1811 14.0426 17.9165 14.1395C18.2886 14.192 18.6284 14.3795 18.8713 14.6662C19.1143 14.9529 19.2433 15.3188 19.234 15.6945Z" stroke={stroke} strokeWidth="1.53197" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Exported so the mobile section (NobodyFallsMobile) reuses the exact same
// pixel-perfect card visuals, just in a different position/animation wrapper.
export function CardBox({ card }: { card: CardDef }) {
  return (
    <div
      style={{
        width: '100%',
        background: '#fff',
        border: '1px solid #ff9191',
        borderRadius: 24,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxSizing: 'border-box',
        boxShadow:
          '0 2px 1px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Header: device icon (radial-gradient tile) + title + subtitle ── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 60,
            height: 60,
            flexShrink: 0,
            padding: 4.8,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at 50% 50%, #e8f1f8 0%, #ffffff 100%)',
          }}
        >
          <img
            src="/assets/nobody-falls/cards/pill-dispenser-icon.png"
            alt=""
            draggable={false}
            style={{ width: 37.4, height: 55.2, objectFit: 'contain' }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minWidth: 0,
          }}
        >
          {/* Title — red bold 16 px */}
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: '#d82525',
              lineHeight: 1.25,
              letterSpacing: 0.26,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {card.title}
          </div>

          {/* Subtitle — grey semi-bold 12 px */}
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 12,
              color: '#808080',
              lineHeight: 1.5,
              letterSpacing: 0.24,
            }}
          >
            {card.subtitle}
          </p>
        </div>
      </div>

      {/* ── Body text — black medium 12 px ── */}
      <p
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: 12,
          color: '#000',
          lineHeight: '20px',
          letterSpacing: 0.39,
          whiteSpace: 'pre-line',
        }}
      >
        {card.body}
      </p>

      {/* ── Primary CTA — dark-blue, 48 px tall, 12 px radius ── */}
      <div
        style={{
          background: '#004172',
          borderRadius: 12,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '8px 16px',
          boxSizing: 'border-box',
          boxShadow:
            '0 2px 2px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        {card.primaryIcon && <PhoneIcon stroke={card.iconStroke} />}
        <span
          style={{
            fontWeight: 500,
            fontSize: 16,
            color: card.secondaryColor ? '#e5e5e5' : '#fff',
            letterSpacing: 0.26,
            whiteSpace: 'nowrap',
          }}
        >
          {card.primaryBtn}
        </span>
      </div>

      {/* ── Secondary text link ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: 16,
            color: '#004172',
            letterSpacing: 0.26,
            whiteSpace: 'nowrap',
          }}
        >
          {card.secondaryBtn}
        </span>
      </div>
    </div>
  );
}
