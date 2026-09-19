import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "arrow-up"
  | "bag"
  | "search"
  | "close"
  | "plus"
  | "minus"
  | "menu"
  | "check"
  | "headphones"
  | "phone"
  | "box"
  | "chevron"
  | "trash"
  | "spark";
const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M4 12h15M13 5l7 7-7 7" />
    </>
  ),
  "arrow-up": (
    <>
      <path d="M5 19 19 5M5 5h14v14" />
    </>
  ),
  bag: (
    <>
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 8h16M4 16h16" />,
  check: <path d="m5 12 4 4L19 6" />,
  headphones: (
    <>
      <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="12" width="5" height="9" rx="2" />
      <rect x="16" y="12" width="5" height="9" rx="2" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5h4M11 19h2" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5" />
    </>
  ),
  chevron: <path d="m9 5 7 7-7 7" />,
  trash: (
    <>
      <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" />
    </>
  ),
  spark: (
    <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />
  ),
};
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
