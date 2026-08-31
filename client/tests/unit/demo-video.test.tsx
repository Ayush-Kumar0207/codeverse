import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DemoVideoPage from "@/app/demo-video/page";

describe("DemoVideoPage", () => {
  it("should render an HTML5 video element", () => {
    const result = render(<DemoVideoPage />);
    const video = result.container.querySelector("video");
    expect(video).not.toBeNull();
  });

  it("points to /media/codeverse-demo.mp4", () => {
    const result = render(<DemoVideoPage />);
    const source = result.container.querySelector("source");

    expect(source?.getAttribute("src")).toBe("/media/codeverse-demo.mp4");
  });

  it("references /media/codeverse-demo-poster.jpg", () => {
    const result = render(<DemoVideoPage />);
    const video = result.container.querySelector("video");

    expect(video?.getAttribute("poster")).toBe("/media/codeverse-demo-poster.jpg");
  });

  it("includes an English captions track at /media/codeverse-demo.vtt", () => {
    const result = render(<DemoVideoPage />);
    const track = result.container.querySelector('track[kind="captions"]');

    expect(track?.getAttribute("src")).toBe("/media/codeverse-demo.vtt");
    expect(track?.getAttribute("kind")).toBe("captions");
    expect(track?.getAttribute("srcLang")).toBe("en");
  });

  it("does not mark the caption track as default", () => {
    const result = render(<DemoVideoPage />);
    const track = result.container.querySelector('track[kind="captions"]');

    expect(track?.getAttribute("default")).toBeNull();
  });

  it("includes the link to the interactive /demo workspace", () => {
    render(<DemoVideoPage />);
    const link = screen.getByRole("link", { name: "Try the interactive demo" });

    expect(link.getAttribute("href")).toBe("/demo");
  });
});
