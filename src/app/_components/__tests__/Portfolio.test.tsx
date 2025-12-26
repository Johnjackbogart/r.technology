import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Portfolio, PortfolioContent } from "../Portfolio";

describe("Portfolio component", () => {
  describe("PortfolioContent", () => {
    it("renders the portfolio heading", () => {
      render(<PortfolioContent />);
      const heading = screen.getByRole("heading", { name: /portfolio/i });
      expect(heading).toBeInTheDocument();
    });

    it("renders through.tech link with correct attributes", () => {
      render(<PortfolioContent />);
      const throughTechLink = screen.getByRole("link", {
        name: /through\.tech/i,
      });

      expect(throughTechLink).toBeInTheDocument();
      expect(throughTechLink).toHaveAttribute(
        "href",
        "https://through.tech",
      );
      expect(throughTechLink).toHaveAttribute("target", "_blank");
      expect(throughTechLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders through.tech tagline", () => {
      render(<PortfolioContent />);
      expect(
        screen.getByText(/need to keep the lights on/i),
      ).toBeInTheDocument();
    });

    it("renders braign.io link with correct attributes", () => {
      render(<PortfolioContent />);
      const braignLink = screen.getByRole("link", { name: /braign\.io/i });

      expect(braignLink).toBeInTheDocument();
      expect(braignLink).toHaveAttribute("href", "https://braign.io");
      expect(braignLink).toHaveAttribute("target", "_blank");
      expect(braignLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders braign.io tagline", () => {
      render(<PortfolioContent />);
      expect(
        screen.getByText(/tools for the technical marketer/i),
      ).toBeInTheDocument();
    });

    it("renders both portfolio links", () => {
      render(<PortfolioContent />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });
  });

  describe("Portfolio wrapper", () => {
    it("renders PortfolioContent", () => {
      render(<Portfolio />);
      expect(
        screen.getByRole("heading", { name: /portfolio/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /through\.tech/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /braign\.io/i }),
      ).toBeInTheDocument();
    });
  });
});
