import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  // Add providers here as needed (ThemeProvider, etc.)
  // For now, just return children since we mock next-themes
  return <>{children}</>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };
