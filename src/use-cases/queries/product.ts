export async function fetchProduct(path: string, origin: string) {
  try {
    const slug = path.replace('/shop/', '');
    const response = await fetch(`${origin}/api/products/${slug}`);
    if (!response.ok) {
      //throw new Error('Failed to fetch product from API');
      return null;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
