export function LoadingSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-zinc-900 rounded-xl relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent"></div>
        </div>
    );
}
