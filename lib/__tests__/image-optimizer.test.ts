import {
  buildOptimizedImagePath,
  getImageCacheControl,
} from "../image-optimizer";

describe("image optimizer helpers", () => {
  it("builds predictable variant paths", () => {
    expect(
      buildOptimizedImagePath("uploads/user/avatar.png", "medium", "webp"),
    ).toBe("uploads/user/avatar/medium.webp");
  });

  it("returns immutable cache headers for optimized variants", () => {
    expect(getImageCacheControl()).toContain("max-age=31536000");
    expect(getImageCacheControl()).toContain("immutable");
  });
});
