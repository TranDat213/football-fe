// components/Footer.tsx

const FOOTER_COLUMNS = [
  {
    heading: "FIND PITCHES",
    links: ["Indoor Arenas", "Outdoor Pitches", "Futsal Courts"],
  },
  {
    heading: "FOR HOSTS",
    links: ["List your Property", "Host Dashboard", "Partner Support"],
  },
  {
    heading: "LEGAL & SUPPORT",
    links: ["Help Center", "Terms of Service", "Privacy Policy"],
  },
];

function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-full bg-emerald-600 text-white`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 7l3 2.2-1.1 3.5h-3.8L9 9.2 12 7z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-gray-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="text-lg font-bold text-white">
              Pitch<span className="text-emerald-500">Perfect</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Connecting players with premium sports facilities. The professional way to book your next match.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h5 className="text-xs font-semibold tracking-wider text-gray-300">{col.heading}</h5>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-800 px-6 pt-6 text-center text-xs text-gray-500">
        © 2026 PitchPerfect. All rights reserved.
      </div>
    </footer>
  );
}