export default function AppLogo() {
    return (
        <>
            <img
                src="/images/logo.png"
                alt="Bozor"
                className="size-8 shrink-0 rounded-md object-cover"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Bozor
                </span>
            </div>
        </>
    );
}
