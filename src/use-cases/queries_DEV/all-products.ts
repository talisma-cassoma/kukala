export async function fetchAllProducts(origin: string) {
 console.log("getStaticPaths: ", origin);

  try {
    const response = await fetch(`${origin}/api/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products from API');
    }

    const products = await response.json();

    return {
      catalogue: {
        children: products.map((product: { path: string }) => ({ path: product.path })),
      },
    };
  } catch (error) {
    throw error;
  }
}
