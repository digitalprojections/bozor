/** Local vector scenes avoid image requests and layout shifts. */
export function WelcomeIllustration({
    scene,
    className = '',
}: {
    scene: 'post' | 'connect' | 'agree';
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 280 160"
            fill="none"
            aria-hidden="true"
            focusable="false"
            className={className}
        >
            <ellipse
                cx="140"
                cy="145"
                rx="104"
                ry="8"
                fill="#0f766e"
                opacity=".08"
            />
            <circle
                cx="140"
                cy="78"
                r="66"
                fill={
                    scene === 'post'
                        ? '#ccfbf1'
                        : scene === 'connect'
                          ? '#fef3c7'
                          : '#dbeafe'
                }
            />
            {scene === 'post' ? (
                <>
                    <rect
                        x="76"
                        y="20"
                        width="123"
                        height="121"
                        rx="12"
                        fill="white"
                        stroke="#0f766e"
                        strokeWidth="3"
                        transform="rotate(-5 140 80)"
                    />
                    <rect
                        x="91"
                        y="34"
                        width="93"
                        height="60"
                        rx="6"
                        fill="#ecfdf5"
                    />
                    <path d="M110 77h53l-6-31h-40l-7 31Z" fill="#f9ba76" />
                    <path
                        d="M110 77v10m53-10v10M125 46v31m23-31v31"
                        stroke="#995d32"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <path
                        d="M97 108h61m-61 12h40"
                        stroke="#b3c9c5"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <circle cx="202" cy="112" r="24" fill="#0f766e" />
                    <path
                        d="M191 112h22m-11-11v22"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        d="M52 55v16m-8-8h16M220 35v12m-6-6h12"
                        stroke="#e9a34c"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </>
            ) : scene === 'connect' ? (
                <>
                    <path d="M64 145v-21a31 31 0 0 1 62 0v21" fill="#0f766e" />
                    <circle cx="95" cy="85" r="19" fill="#eab68c" />
                    <path
                        d="M76 83c-3-27 39-32 39 0l-12-11-27 11Z"
                        fill="#253b42"
                    />
                    <path d="M158 145v-21a31 31 0 0 1 62 0v21" fill="#df8c55" />
                    <circle cx="189" cy="85" r="19" fill="#bd805f" />
                    <path
                        d="M170 82c-3-28 40-30 39 1l-13-12-26 11Z"
                        fill="#253b42"
                    />
                    <path
                        d="M89 18h74a12 12 0 0 1 12 12v22a12 12 0 0 1-12 12h-37l-16 13V64H89a12 12 0 0 1-12-12V30a12 12 0 0 1 12-12Z"
                        fill="white"
                        stroke="#d5ad54"
                        strokeWidth="2"
                    />
                    <circle cx="105" cy="41" r="4" fill="#0f766e" />
                    <circle cx="126" cy="41" r="4" fill="#0f766e" />
                    <circle cx="147" cy="41" r="4" fill="#0f766e" />
                    <path
                        d="m209 37 6 6 11-13"
                        stroke="#0f766e"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            ) : (
                <>
                    <rect
                        x="88"
                        y="58"
                        width="104"
                        height="78"
                        rx="7"
                        fill="#efba80"
                    />
                    <path
                        d="M88 79h104M130 58v35l10-6 10 6V58"
                        stroke="#b77940"
                        strokeWidth="3"
                    />
                    <path
                        d="m39 94 45 20 27-2c12 0 13 13 2 17l-37 7-43-17"
                        fill="#bd805f"
                    />
                    <path
                        d="m241 94-45 20-27-2c-12 0-13 13-2 17l37 7 43-17"
                        fill="#eab68c"
                    />
                    <path d="m31 88 22 10-13 32-19-9" fill="#0f766e" />
                    <path d="m249 88-22 10 13 32 19-9" fill="#6686b7" />
                    <circle cx="140" cy="32" r="22" fill="#0f766e" />
                    <path
                        d="m130 32 7 7 14-15"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M67 37v13m-6-6h12M215 49v13m-6-6h12"
                        stroke="#e9a34c"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </>
            )}
        </svg>
    );
}
