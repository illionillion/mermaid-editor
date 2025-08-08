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
  _Result,
  Props = undefined,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
> extends OriginalRenderHookOptions<Props, Q, Container, BaseElement> {
  withProvider?: boolean;
  providerProps?: Omit<UIProviderProps, "children">;
}

export function renderHook<
  Result,
  Props = undefined,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  renderFn: (initialProps: Props) => Result,
  {
    withProvider = true,
    providerProps,
    ...options
  }: RenderHookOptions<Result, Props, Q, Container, BaseElement> = {}
) {
  if (withProvider)
    options.wrapper ??= (props: PropsWithChildren) => (
      <UIProvider {...providerProps}>{props.children}</UIProvider>
    );

  return originalRenderHook<Result, Props, Q, Container, BaseElement>(renderFn, options);
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
