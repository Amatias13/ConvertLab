import { describe, it, expect } from "vitest";

// ── Base64 encode/decode (from Base64Tool) ───────────────────────
const encode = (plain) => {
  if (!plain) throw new Error("empty");
  return btoa(unescape(encodeURIComponent(plain)));
};

const decode = (enc) => {
  let v = enc.replace(/\s/g, "");
  if (v.startsWith("data:")) v = v.split(",")[1] ?? "";
  return decodeURIComponent(escape(atob(v)));
};

describe("Base64 encode", () => {
  it("encodes ASCII string", () => {
    expect(encode("hello")).toBe("aGVsbG8=");
  });

  it("encodes unicode (emoji)", () => {
    expect(() => encode("🔥")).not.toThrow();
    expect(decode(encode("🔥"))).toBe("🔥");
  });

  it("encodes unicode (accented chars)", () => {
    expect(decode(encode("André"))).toBe("André");
  });

  it("throws on empty string", () => {
    expect(() => encode("")).toThrow();
  });
});

describe("Base64 decode", () => {
  it("decodes known value", () => {
    expect(decode("aGVsbG8=")).toBe("hello");
  });

  it("strips whitespace before decoding", () => {
    expect(decode("aGVs  bG8=")).toBe("hello");
  });

  it("handles data URL prefix", () => {
    expect(decode("data:text/plain;base64,aGVsbG8=")).toBe("hello");
  });

  it("round-trips encode → decode", () => {
    const samples = ["hello world", "123", "foo/bar=baz", "αβγ"];
    samples.forEach((s) => expect(decode(encode(s))).toBe(s));
  });
});

// ── URL encode/decode (from UrlTool) ─────────────────────────────
describe("URL encodeURIComponent", () => {
  it("encodes special characters", () => {
    expect(encodeURIComponent("hello world")).toBe("hello%20world");
    expect(encodeURIComponent("a=b&c=d")).toBe("a%3Db%26c%3Dd");
    expect(encodeURIComponent("https://example.com/path?q=1")).toContain("%3A%2F%2F");
  });

  it("does not encode unreserved characters", () => {
    expect(encodeURIComponent("abcABC123-_.~")).toBe("abcABC123-_.~");
  });
});

describe("URL decodeURIComponent", () => {
  it("decodes percent-encoded string", () => {
    expect(decodeURIComponent("hello%20world")).toBe("hello world");
    expect(decodeURIComponent("a%3Db%26c%3Dd")).toBe("a=b&c=d");
  });

  it("round-trips encode → decode", () => {
    const url = "https://example.com/path?q=hello world&lang=en";
    expect(decodeURIComponent(encodeURIComponent(url))).toBe(url);
  });

  it("throws on malformed percent encoding", () => {
    expect(() => decodeURIComponent("%zz")).toThrow();
  });
});

// ── URL parsing (from UrlTool — uses native URL API) ─────────────
describe("URL parsing", () => {
  it("parses protocol, host, pathname", () => {
    const u = new URL("https://example.com/path");
    expect(u.protocol).toBe("https:");
    expect(u.host).toBe("example.com");
    expect(u.pathname).toBe("/path");
  });

  it("parses query parameters", () => {
    const u = new URL("https://example.com?a=1&b=2");
    expect(u.searchParams.get("a")).toBe("1");
    expect(u.searchParams.get("b")).toBe("2");
  });

  it("parses hash", () => {
    const u = new URL("https://example.com#section");
    expect(u.hash).toBe("#section");
  });

  it("throws on invalid URL (no protocol)", () => {
    expect(() => new URL("example.com")).toThrow();
  });

  it("throws on empty string", () => {
    expect(() => new URL("")).toThrow();
  });
});
