import { authOptions } from "./auth";

describe("Auth Configuration", () => {
  it("should have correct session strategy", () => {
    expect(authOptions.session?.strategy).toBe("jwt");
  });

  it("should have NextAuth secret configured", () => {
    expect(authOptions.secret).toBeDefined();
  });

  it("should have email provider configured", () => {
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].id).toBe("email");
  });

  it("should have correct custom pages configured", () => {
    expect(authOptions.pages).toEqual({
      signIn: "/auth/signin",
      verifyRequest: "/auth/verify-request",
      error: "/auth/signin",
    });
  });

  it("should have Prisma adapter configured", () => {
    expect(authOptions.adapter).toBeDefined();
  });

  describe("redirect callback", () => {
    const baseUrl = "http://localhost:3000";

    it("should redirect to the provided URL if it starts with baseUrl", async () => {
      const result = await authOptions.callbacks?.redirect?.({
        url: `${baseUrl}/goals`,
        baseUrl,
      });
      expect(result).toBe(`${baseUrl}/goals`);
    });

    it("should redirect to /goals if URL does not start with baseUrl", async () => {
      const result = await authOptions.callbacks?.redirect?.({
        url: "http://evil.com/phishing",
        baseUrl,
      });
      expect(result).toBe(`${baseUrl}/goals`);
    });

    it("should redirect to same URL when it matches baseUrl", async () => {
      const result = await authOptions.callbacks?.redirect?.({
        url: baseUrl,
        baseUrl,
      });
      expect(result).toBe(baseUrl);
    });
  });

  describe("session callback", () => {
    it("should add user ID to session from token", async () => {
      const mockSession = {
        user: {
          email: "test@test.com",
        },
        expires: "2025-12-31",
      };
      const mockToken = {
        sub: "user-123",
      };

      const result = await authOptions.callbacks?.session?.({
        session: mockSession,
        token: mockToken,
      });

      expect(result?.user?.id).toBe("user-123");
    });

    it("should return session unchanged if no token.sub", async () => {
      const mockSession = {
        user: {
          email: "test@test.com",
        },
        expires: "2025-12-31",
      };
      const mockToken = {};

      const result = await authOptions.callbacks?.session?.({
        session: mockSession,
        token: mockToken,
      });

      expect(result?.user?.id).toBeUndefined();
    });
  });

  describe("jwt callback", () => {
    it("should add user ID to token on sign in", async () => {
      const mockToken = {};
      const mockUser = {
        id: "user-123",
        email: "test@test.com",
      };

      const result = await authOptions.callbacks?.jwt?.({
        token: mockToken,
        user: mockUser,
      });

      expect(result?.sub).toBe("user-123");
    });

    it("should return token unchanged if no user", async () => {
      const mockToken = { sub: "existing-id" };

      const result = await authOptions.callbacks?.jwt?.({
        token: mockToken,
      });

      expect(result?.sub).toBe("existing-id");
    });
  });
});
