import type { APIRoute } from "astro";
import { getSiteSettings } from "emdash";

export const GET: APIRoute = async () => {
	const headers = { "Content-Type": "application/json" };
	try {
		// A lightweight CMS read confirms the database binding is reachable.
		await getSiteSettings();
		return new Response(
			JSON.stringify({
				status: "healthy",
				message: "All systems operational",
				cms: true,
				timestamp: new Date().toISOString(),
			}),
			{ status: 200, headers },
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				status: "degraded",
				message: "CMS unavailable",
				cms: false,
				error: error instanceof Error ? error.message : "Unknown error",
				timestamp: new Date().toISOString(),
			}),
			{ status: 200, headers },
		);
	}
};
