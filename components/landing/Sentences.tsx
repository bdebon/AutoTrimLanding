/** "Coupe les silences. Et les euh." on two lines: one sentence per line, never "Et" orphaned. */
export default function Sentences({ text }: { text: string }) {
  const parts = text.split(/(?<=[.!?])\s+/);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className="block">
          {part}
        </span>
      ))}
    </>
  );
}
