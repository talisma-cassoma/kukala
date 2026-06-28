export async function fetchFrontPage(origin: string) {
  try {
    const response = await fetch(`${origin}/api/frontpage`);
    if (!response.ok) {
      throw new Error('Failed to fetch frontpage from API');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
