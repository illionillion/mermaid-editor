import type {
  RenderHookOptions as OriginalRenderHookOptions,
  RenderOptions as OriginalRenderOptions,
  Queries,
  queries,
} from "@testing-library/react";
import { render as originalRender, renderHook as originalRenderHook } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { UIProviderProps } from "@yamada-ui/react";
import { UIProvider } from "@yamada-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import type { Container } from "react-dom/client";
import "@testing-library/jest-dom/vitest";

export interface RenderOptions extends OriginalRenderOptions {
  withProvider?: boolean;
  providerProps?: Omit<UIProviderProps, "children">;
}

export interface RenderReturn extends ReturnType<typeof originalRender> {
  user: ReturnType<typeof userEvent.setup>;
}

export function render(
  ui: ReactNode,
  { withProvider = true, providerProps, ...options }: RenderOptions = {}
): RenderReturn {
  const user = userEvent.setup();

  if (withProvider)
    options.wrapper ??= (props: PropsWithChildren) => (
      <UIProvider {...providerProps}>{props.children}</UIProvider>
    );

  const result = originalRender(ui, options);

  return { user, ...result };
}

export interface RenderHookOptions<
  Y,
  M extends Queries = typeof queries,
  D extends Container | Document | Element = HTMLElement,
  H extends Container | Document | Element = D,
> extends OriginalRenderHookOptions<Y, M, D, H> {
  withProvider?: boolean;
  providerProps?: Omit<UIProviderProps, "children">;
}

export function renderHook<
  Y,
  M,
  D extends Queries = typeof queries,
  H extends Container | Document | Element = HTMLElement,
  R extends Container | Document | Element = H,
>(
  renderFn: (props: M) => Y,
  { withProvider = true, providerProps, ...options }: RenderHookOptions<M, D, H, R> = {}
) {
  if (withProvider)
    options.wrapper ??= (props: PropsWithChildren) => (
      <UIProvider {...providerProps}>{props.children}</UIProvider>
    );

  return originalRenderHook<Y, M, D, H, R>(renderFn, options);
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
