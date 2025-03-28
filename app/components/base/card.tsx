export function Card({
  title,
  content,
  sub,
}: {
  title: string;
  content: string;
  sub: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
      <div className="text-[13px] tracking-wide uppercase font-mono text-gray-400 mb-2">
        {title}
      </div>
      <div className="text-xl font-semibold">{content}</div>
      <div className="text-[13px] text-gray-400 mt-1">{sub}</div>
    </div>
  );
}
