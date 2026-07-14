export interface NavItem {
  /** Visible label. Note: "Take Care " keeps its trailing space, matching the Figma source exactly. */
  label: string;
  href: string;
  active?: boolean;
}

/** Primary navigation items (Figma node 12169:4285 "Frame 1"). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Take Care ', href: '#', active: true },
  { label: 'Our Services', href: '#' },
  { label: 'Our Team', href: '#' },
  { label: 'About Us', href: '#' },
  { label: 'Join Us', href: '#' },
];
