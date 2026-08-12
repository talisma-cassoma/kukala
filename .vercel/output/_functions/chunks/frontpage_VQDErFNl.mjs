//#region src/use-cases/queries/frontpage.ts
async function fetchFrontPage(origin) {
	try {
		const response = await fetch(`${origin}/api/frontpage`);
		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		throw error;
	}
}
//#endregion
export { fetchFrontPage as t };
