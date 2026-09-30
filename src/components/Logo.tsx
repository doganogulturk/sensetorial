export default function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <rect width="32" height="32" rx="8" className="fill-accent" />
        <path
          d="M20.5 11.2c-.9-1.2-2.5-2-4.4-2-2.7 0-4.6 1.5-4.6 3.6 0 4.8 9.3 2.6 9.3 7 0 2.1-2 3.7-4.8 3.7-2 0-3.8-.9-4.8-2.3"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="stroke-accent-fg"
        />
      </svg>
      <span className="text-[17px]">Sensetorial</span>
    </span>
  )
}
