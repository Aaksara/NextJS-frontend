import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag }));

const { POST } = await import("./route");

function post(authorization?: string) {
	const headers = authorization ? { authorization } : undefined;
	return POST(
		new Request("http://localhost/api/home-page/revalidate", { method: "POST", headers }),
	);
}

const me = (status: number, body: unknown = {}) =>
	vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })));

beforeEach(() => {
	revalidateTag.mockClear();
	vi.unstubAllGlobals();
});

describe("POST /api/home-page/revalidate", () => {
	it("clears the home page cache for the super admin", async () => {
		me(200, { is_superuser: true });
		expect((await post("Bearer admin")).status).toBe(204);
		expect(revalidateTag).toHaveBeenCalledWith("home-content", { expire: 0 });
	});

	it.each([
		["no token", undefined, 401, 200, {}],
		["a rejected token", "Bearer old", 401, 401, {}],
		["a student", "Bearer student", 403, 200, { is_superuser: false }],
	])("refuses %s", async (_case, authorization, expected, apiStatus, body) => {
		me(apiStatus, body);
		expect((await post(authorization)).status).toBe(expected);
		expect(revalidateTag).not.toHaveBeenCalled();
	});
});
