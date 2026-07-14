export async function fetchContent() {
  const res = await fetch('/api/content');
  if (!res.ok) {
    throw new Error('Failed to load content');
  }
  return res.json();
}
