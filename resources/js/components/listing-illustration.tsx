export function ListingIllustration({
    kind,
    className,
}: {
    kind: 'item' | 'service' | 'announcement';
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 180 180"
            fill="none"
            className={className}
            aria-hidden="true"
            focusable="false"
        >
            <circle
                cx="90"
                cy="90"
                r="80"
                fill={
                    kind === 'item'
                        ? '#e0f3ea'
                        : kind === 'service'
                          ? '#fff0d7'
                          : '#e9efff'
                }
            />
            <ellipse
                cx="90"
                cy="145"
                rx="59"
                ry="8"
                fill="#244638"
                opacity=".1"
            />
            {kind === 'item' ? (
                <>
                    <rect
                        x="45"
                        y="29"
                        width="90"
                        height="115"
                        rx="10"
                        fill="white"
                        stroke="#659e8a"
                        strokeWidth="3"
                    />
                    <path d="M46 57h88" stroke="#c3dfd3" strokeWidth="3" />
                    <rect
                        x="56"
                        y="39"
                        width="25"
                        height="8"
                        rx="3"
                        fill="#bfded0"
                    />
                    <circle cx="119" cy="43" r="6" fill="#0f766e" />
                    <circle
                        cx="90"
                        cy="96"
                        r="31"
                        fill="#c1e1df"
                        stroke="#0f766e"
                        strokeWidth="6"
                    />
                    <circle cx="90" cy="96" r="22" fill="#527c89" />
                    <path
                        d="M70 101q11-13 21 0t20-1a22 22 0 0 1-41 1"
                        fill="#e6f5f6"
                    />
                    <path
                        d="m77 82 8-5"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        d="M54 145v5m72-5v5"
                        stroke="#41665a"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                </>
            ) : kind === 'service' ? (
                <>
                    <rect
                        x="22"
                        y="63"
                        width="87"
                        height="65"
                        rx="7"
                        fill="#0f766e"
                    />
                    <path d="M109 81h26l23 28v19h-49V81Z" fill="#e8a65b" />
                    <path d="M117 88h15l15 19h-30V88Z" fill="#e9f7f7" />
                    <rect
                        x="19"
                        y="123"
                        width="143"
                        height="10"
                        rx="4"
                        fill="#3a5652"
                    />
                    <circle cx="49" cy="133" r="14" fill="#304b48" />
                    <circle cx="49" cy="133" r="6" fill="#d8e4de" />
                    <circle cx="134" cy="133" r="14" fill="#304b48" />
                    <circle cx="134" cy="133" r="6" fill="#d8e4de" />
                    <rect
                        x="39"
                        y="36"
                        width="29"
                        height="27"
                        rx="3"
                        fill="#eab581"
                    />
                    <rect
                        x="70"
                        y="26"
                        width="29"
                        height="37"
                        rx="3"
                        fill="#f5cc99"
                    />
                    <path
                        d="M53 36v11m31-21v13"
                        stroke="#af7540"
                        strokeWidth="5"
                    />
                    <path
                        d="M40 87h47m-12-9 12 9-12 9"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            ) : (
                <>
                    <ellipse
                        cx="90"
                        cy="116"
                        rx="67"
                        ry="31"
                        fill="white"
                        stroke="#6d90b1"
                        strokeWidth="3"
                    />
                    <ellipse cx="90" cy="111" rx="55" ry="24" fill="#d7e7f4" />
                    <path
                        d="M42 109c0-51 96-51 96 0-22 22-73 22-96 0Z"
                        fill="#dfad52"
                    />
                    <path
                        d="m58 95 6-5m9 16 6-5m7-19 6-4m12 26 5-5m9-10 6 3m-25 22 6-2m-51-10 5 2m21-7 5 3"
                        stroke="#fff0b6"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        d="m65 81 9 8m30-14-5 11m21 15-10-5m-24 11 5-9"
                        stroke="#d67936"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path d="m79 75 9-7 12 7-4 11-15-1Z" fill="#885337" />
                    <path
                        d="M61 55q-9-9 0-18m29 16q-9-9 0-18m29 20q-9-9 0-18"
                        stroke="#91a5ac"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <path
                        d="m124 76 8-9m-8 9 13 1"
                        stroke="#47835a"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                </>
            )}
        </svg>
    );
}
