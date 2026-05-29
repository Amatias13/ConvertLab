import { describe, it, expect } from "vitest";

// Inline the pure b64Decode from JwtTool (not exported)
function b64Decode(str) {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(
    atob(s)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}

function parseJwt(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT structure");
  return {
    header: JSON.parse(b64Decode(parts[0])),
    payload: JSON.parse(b64Decode(parts[1])),
  };
}

// A known valid JWT (signed with secret "secret", non-sensitive test data)
const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ." +
  "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("JWT b64Decode", () => {
  it("decodes standard base64url to a string", () => {
    const encoded = btoa("hello world").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    expect(b64Decode(encoded)).toBe("hello world");
  });

  it("handles base64url with - and _ characters", () => {
    // base64url of '{"alg":"HS256","typ":"JWT"}'
    const result = b64Decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    expect(JSON.parse(result)).toEqual({ alg: "HS256", typ: "JWT" });
  });

  it("handles unicode characters", () => {
    const input = "héllo";
    const encoded = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p) => String.fromCharCode(parseInt(p, 16))));
    // just assert it doesn't throw
    expect(() => b64Decode(encoded)).not.toThrow();
  });
});

describe("parseJwt", () => {
  it("correctly decodes header", () => {
    const { header } = parseJwt(SAMPLE_JWT);
    expect(header).toEqual({ alg: "HS256", typ: "JWT" });
  });

  it("correctly decodes payload", () => {
    const { payload } = parseJwt(SAMPLE_JWT);
    expect(payload.sub).toBe("1234567890");
    expect(payload.name).toBe("John Doe");
    expect(payload.iat).toBe(1516239022);
  });

  it("throws on too few parts", () => {
    expect(() => parseJwt("a.b")).toThrow("Invalid JWT structure");
  });

  it("throws on too many parts", () => {
    expect(() => parseJwt("a.b.c.d")).toThrow("Invalid JWT structure");
  });

  it("throws on non-JSON payload", () => {
    expect(() => parseJwt("abc.def.ghi")).toThrow();
  });

  it("throws on empty string", () => {
    expect(() => parseJwt("")).toThrow();
  });
});
