import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type ReactNode } from "react";
import {
  type PerformanceProfile,
  usePerformanceProfile,
} from "@/lib/usePerformanceProfile";
import { ThreeCanvas } from "./Canvas";

type CanvasMockProps = {
  children?: ReactNode;
  dpr?: unknown;
  gl?: {
    alpha?: boolean;
    antialias?: boolean;
    powerPreference?: string;
  };
};

type PerformanceMonitorMockProps = {
  onDecline?: () => void;
  onIncline?: () => void;
};

const mockState = vi.hoisted(() => ({
  canvasProps: [] as Array<Omit<CanvasMockProps, "children">>,
  performanceMonitorProps: [] as PerformanceMonitorMockProps[],
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: CanvasMockProps) => {
    mockState.canvasProps.push(props);
    return <div data-testid="three-canvas">{children}</div>;
  },
}));

vi.mock("@react-three/drei", () => ({
  PerformanceMonitor: (props: PerformanceMonitorMockProps) => {
    mockState.performanceMonitorProps.push(props);
    return <div data-testid="performance-monitor" />;
  },
}));

vi.mock("./Effects", () => ({
  Effects: () => <div data-testid="effects" />,
}));

vi.mock("./Environment", () => ({
  Environment: () => <div data-testid="environment" />,
}));

vi.mock("./Loader", () => ({
  Loader: () => <div data-testid="loader" />,
}));

vi.mock("./ScrollResponsiveScene", () => ({
  default: () => <div data-testid="scroll-responsive-scene" />,
}));

vi.mock("@/lib/usePerformanceProfile", () => ({
  usePerformanceProfile: vi.fn(),
}));

const mockedUsePerformanceProfile = vi.mocked(usePerformanceProfile);

const standardProfile: PerformanceProfile = {
  level: "standard",
  dpr: [1, 1.5],
  disableEffects: false,
  particleMultiplier: 0.6,
};

let animationFrames: Map<number, FrameRequestCallback>;
let nextAnimationFrameId: number;

function latestPerformanceMonitorProps() {
  const props = mockState.performanceMonitorProps.at(-1);

  if (!props) {
    throw new Error("Expected PerformanceMonitor to render");
  }

  return props;
}

function runNextAnimationFrame(now: number) {
  const nextFrame = animationFrames.entries().next().value;

  if (!nextFrame) {
    throw new Error("Expected a scheduled animation frame");
  }

  const [id, callback] = nextFrame;
  animationFrames.delete(id);

  act(() => {
    callback(now);
  });
}

describe("ThreeCanvas performance controls", () => {
  beforeEach(() => {
    mockState.canvasProps.length = 0;
    mockState.performanceMonitorProps.length = 0;
    animationFrames = new Map();
    nextAnimationFrameId = 0;

    mockedUsePerformanceProfile.mockReturnValue(standardProfile);

    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      nextAnimationFrameId += 1;
      animationFrames.set(nextAnimationFrameId, callback);
      return nextAnimationFrameId;
    });

    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      animationFrames.delete(id);
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("cycles manual performance override from auto to low to high and back to auto", async () => {
    const user = userEvent.setup();
    render(<ThreeCanvas />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("performance: auto");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: auto; effective mode: high",
    );
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveTextContent("performance: low");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: low; effective mode: low",
    );
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(button).toHaveTextContent("performance: high");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: high; effective mode: high",
    );

    await user.click(button);
    expect(button).toHaveTextContent("performance: auto");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: auto; effective mode: high",
    );
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("does not treat touchstart as a second toggle input", () => {
    render(<ThreeCanvas />);

    const button = screen.getByRole("button");

    fireEvent.touchStart(button);

    expect(button).toHaveTextContent("performance: auto");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: auto; effective mode: high",
    );
  });

  it("lets auto mode degrade without registering an automatic promotion path", () => {
    render(<ThreeCanvas />);

    const button = screen.getByRole("button");
    const { onDecline, onIncline } = latestPerformanceMonitorProps();

    expect(onIncline).toBeUndefined();

    if (!onDecline) {
      throw new Error("Expected PerformanceMonitor onDecline callback");
    }

    act(() => {
      onDecline();
    });

    expect(button).toHaveTextContent("performance: auto");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: auto; effective mode: low",
    );
  });

  it("keeps auto mode in low after later high-FPS frames", () => {
    const start = performance.now();
    render(<ThreeCanvas />);

    const button = screen.getByRole("button");

    for (let i = 1; i <= 30; i += 1) {
      runNextAnimationFrame(start + i * 100);
    }

    expect(button).toHaveTextContent("performance: auto");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: auto; effective mode: low",
    );

    for (let i = 1; i <= 180; i += 1) {
      runNextAnimationFrame(start + 3000 + i * 16);
    }

    expect(button).toHaveTextContent("performance: auto");
    expect(button).toHaveAttribute(
      "aria-label",
      "Performance override: auto; effective mode: low",
    );
  });
});
