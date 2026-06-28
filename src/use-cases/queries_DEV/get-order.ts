export async function getOrderById(id: string) {
  const response = await fetch(`${import.meta.env.PUBLIC_SITE_URL ?? ''}/api/orders/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch order from API');
  }

  return await response.json();
}
