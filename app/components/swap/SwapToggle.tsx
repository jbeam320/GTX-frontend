export default function SwapToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="flex justify-center mt-4 mb-4 w-full">
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full shadow-xl"
      >
        <span className="text-xl">⟷</span>
      </button>
    </div>
  );
}
