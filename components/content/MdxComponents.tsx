import Link from "next/link";
import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";

function A({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  a: A,
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
};
