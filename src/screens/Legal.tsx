type Section = { heading: string; body: string };

type Props = {
  title: string;
  lastUpdated: string;
  sections: Section[];
  onBack: () => void;
};

// Reusable static-content screen, used for both Privacy Policy and Terms of
// Service — same layout, different copy passed in as props.
export default function Legal({ title, lastUpdated, sections, onBack }: Props) {
  return (
    <div
      className="flex flex-col h-dvh overflow-y-auto"
      style={{ background: "var(--background)" }}
    >
      <div className="px-4 pt-14 pb-2 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(168,85,247,0.1)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1
            className="font-extrabold"
            style={{ fontSize: 20, letterSpacing: "-0.4px", color: "var(--foreground)" }}
          >
            {title}
          </h1>
          <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
            {lastUpdated}
          </p>
        </div>
      </div>

      <div className="px-6 pb-10 flex flex-col gap-5 pt-4">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2
              className="font-bold mb-1.5"
              style={{ fontSize: 14, color: "#c4b5fd" }}
            >
              {s.heading}
            </h2>
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
