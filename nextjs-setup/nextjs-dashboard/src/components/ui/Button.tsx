import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type BtnProps = {
  variant?: Variant;
} & (
  | ({ as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: "a" } & AnchorHTMLAttributes<HTMLAnchorElement>)
);

/** Button — UI primitive.
 *  Two variants: primary (emerald fill) and secondary (ghost).
 *  Can render as <button> or <a> via the `as` prop.
 */
export default function Button({
  variant = "primary",
  as: Tag = "button",
  className = "",
  children,
  ...rest
}: BtnProps) {
  const cls = `btn ${variant} ${className}`.trim();
  // @ts-expect-error — polymorphic component, types are safe by prop constraint
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
