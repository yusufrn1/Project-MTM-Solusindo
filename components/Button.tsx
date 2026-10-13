import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition";

  const variants = {
    primary: "bg-blue-800 text-white hover:bg-blue-900",
    secondary:
      "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}