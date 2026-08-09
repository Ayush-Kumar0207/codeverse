import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NetworkTopology } from "@/components/NetworkTopology";

describe("NetworkTopology", () => {
  it("tracks the real upload and verification legs before completion", () => {
    const { rerender } = render(<NetworkTopology status="syncing" phase="uploading" isSynced={false} />);
    expect(screen.getByRole("img", { name: /uploading to cloud/i })).toBeInTheDocument();
    expect(screen.getByText("This device")).toBeInTheDocument();
    expect(screen.getByText("Cloud API")).toBeInTheDocument();
    expect(screen.getByText("Snapshot history")).toBeInTheDocument();

    rerender(<NetworkTopology status="syncing" phase="verifying" isSynced={false} />);
    expect(screen.getByRole("img", { name: /verifying snapshot history/i })).toBeInTheDocument();

    rerender(<NetworkTopology status="synced" phase="complete" isSynced />);
    expect(screen.getByRole("img", { name: /snapshot verified/i })).toBeInTheDocument();
  });

  it("shows device-safe queued work without pretending data is moving", () => {
    render(<NetworkTopology status="pending" phase="queued" isSynced={false} />);
    expect(screen.getByRole("img", { name: /saved on device.*retry queued/i })).toBeInTheDocument();
    expect(screen.queryByText("Snapshot verified")).not.toBeInTheDocument();
  });

  it("shows an interrupted connection as an error, not a successful transfer", () => {
    render(<NetworkTopology status="error" phase="failed" isSynced={false} />);
    expect(screen.getByRole("img", { name: /sync could not continue/i })).toBeInTheDocument();
    expect(screen.queryByText("Snapshot verified")).not.toBeInTheDocument();
  });
});
