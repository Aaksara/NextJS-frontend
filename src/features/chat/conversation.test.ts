import { describe, expect, it } from "vitest";

import { otherSide } from "./conversation";
import type { Conversation } from "./types";

const buyer = { id: 1, full_name: "Ana Buyer", department: "", avatar: null, date_joined: "" };
const seller = { id: 2, full_name: "Sam Seller", department: "", avatar: null, date_joined: "" };
const conversation = { buyer, seller } as Conversation;

describe("otherSide", () => {
	it("is the buyer for the seller, and the seller for the buyer", () => {
		expect(otherSide(conversation, seller.id)).toBe(buyer);
		expect(otherSide(conversation, buyer.id)).toBe(seller);
	});
});
