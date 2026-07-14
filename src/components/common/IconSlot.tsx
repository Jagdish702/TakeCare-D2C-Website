// Figma wraps every trailing chevron / calendar glyph in its own drop-shadow
// (Dev Mode: `drop-shadow-[0px_2px_8px_rgba(0,65,114,0.08)]`) — distinct from
// the shadow baked into some SVGs' own <filter>.
const ICON_SHADOW: React.CSSProperties = { filter: 'drop-shadow(0px 2px 8px rgba(0,65,114,0.08))' };

/**
 * 24×24 icon slot (matches Figma's icon wrapper size) that centres a glyph
 * rendered at its own exact natural size, rather than stretching the glyph
 * to fill the full 24×24 box. `shadow` is only needed for glyphs that don't
 * already bake their drop-shadow into the SVG's own <filter>.
 */
export default function IconSlot({
  src,
  width,
  height,
  alt = '',
  shadow = false,
}: {
  src: string;
  width: number;
  height: number;
  alt?: string;
  shadow?: boolean;
}) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center" style={shadow ? ICON_SHADOW : undefined}>
      <img src={src} alt={alt} style={{ width, height }} />
    </span>
  );
}
