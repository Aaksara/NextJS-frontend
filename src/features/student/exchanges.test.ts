import { describe, expect, it } from "vitest";

import { counterpart } from "./exchanges";
import type { Exchange } from "./types";

const buyer = { id: 1, full_name: "Ana Buyer", department: "", avatar: null, date_joined: "" };
const seller = { id: 2, full_name: "Sam Seller", department: "", avatar: null, date_joined: "" };

const exchange = (role: Exchange["role"]) => ({ role, requester: buyer, seller }) as Exchange;

describe("counterpart", () => {
	it("is the requester for the seller, and the seller for the requester", () => {
		expect(counterpart(exchange("seller"))).toBe(buyer);
		expect(counterpart(exchange("requester"))).toBe(seller);
	});
});
