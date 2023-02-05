import * as React from "react";

function People(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M349.1 334.7c-11.2-4-29.5-4.2-37.6-7.3-5.6-2.2-14.5-4.6-17.4-8.1-2.9-3.5-2.9-28.5-2.9-28.5s7-6.6 9.9-14c2.9-7.3 4.8-27.5 4.8-27.5s6.6 2.8 9.2-10.4c2.2-11.4 6.4-17.4 5.3-25.8-1.2-8.4-5.8-6.4-5.8-6.4s5.8-8.5 5.8-37.4c0-29.8-22.5-59.1-64.6-59.1-42 0-64.7 29.4-64.7 59.1 0 28.9 5.7 37.4 5.7 37.4s-4.7-2-5.8 6.4c-1.2 8.4 3 14.4 5.3 25.8 2.6 13.3 9.2 10.4 9.2 10.4s1.9 20.1 4.8 27.5c2.9 7.4 9.9 14 9.9 14s0 25-2.9 28.5-11.8 5.9-17.4 8c-8 3.1-26.3 3.5-37.6 7.5-11.2 4-45.8 22.2-45.8 67.2h278.3c.1-45.1-34.5-63.3-45.7-67.3z" />
      <path d="M140 286s23.9-.8 33.4-9.3c-15.5-23.5-7.1-50.9-10.3-76.5-3.2-25.5-17.7-40.8-46.7-40.8h-.4c-28 0-43.1 15.2-46.3 40.8-3.2 25.5 5.7 56-10.2 76.5C69 285.3 93 285 93 285s1 14.4-1 16.8c-2 2.4-7.9 4.7-12 5.5-8.8 1.9-18.1 4.5-25.9 7.2-7.8 2.7-22.6 17.2-22.6 37.2h80.3c2.2-8 17.3-22.3 32-29.8 9-4.6 17.9-4.3 24.7-5.2 0 0 3.8-6-8.7-8.3 0 0-17.2-4.3-19.2-6.7-1.9-2.2-.6-15.7-.6-15.7zM372 286s-23.9-.8-33.4-9.3c15.5-23.5 7.1-50.9 10.3-76.5 3.2-25.5 17.7-40.8 46.7-40.8h.4c28 0 43.1 15.2 46.3 40.8 3.2 25.5-5.7 56 10.2 76.5-9.5 8.6-33.5 8.3-33.5 8.3s-1 14.4 1 16.8c2 2.4 7.9 4.7 12 5.5 8.8 1.9 18.1 4.5 25.9 7.2 7.8 2.7 22.6 17.2 22.6 37.2h-80.3c-2.2-8-17.3-22.3-32-29.8-9-4.6-17.9-4.3-24.7-5.2 0 0-3.8-6 8.7-8.3 0 0 17.2-4.3 19.2-6.7 1.9-2.2.6-15.7.6-15.7z" />
    </svg>
  );
}

function MicOff(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 640 512"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M633.82 458.1l-157.8-121.96C488.61 312.13 496 285.01 496 256v-48c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v48c0 17.92-3.96 34.8-10.72 50.2l-26.55-20.52c3.1-9.4 5.28-19.22 5.28-29.67V96c0-53.02-42.98-96-96-96s-96 42.98-96 96v45.36L45.47 3.37C38.49-2.05 28.43-.8 23.01 6.18L3.37 31.45C-2.05 38.42-.8 48.47 6.18 53.9l588.36 454.73c6.98 5.43 17.03 4.17 22.46-2.81l19.64-25.27c5.41-6.97 4.16-17.02-2.82-22.45zM400 464h-56v-33.77c11.66-1.6 22.85-4.54 33.67-8.31l-50.11-38.73c-6.71.4-13.41.87-20.35.2-55.85-5.45-98.74-48.63-111.18-101.85L144 241.31v6.85c0 89.64 63.97 169.55 152 181.69V464h-56c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16z" />
    </svg>
  );
}

function ChatOutlined(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChatActive(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 008 15z" />
    </svg>
  );
}

function MicOutlined(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M3.5 6.5A.5.5 0 014 7v1a4 4 0 008 0V7a.5.5 0 011 0v1a5 5 0 01-4.5 4.975V15h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 013 8V7a.5.5 0 01.5-.5z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M10 8V3a2 2 0 10-4 0v5a2 2 0 104 0zM8 0a3 3 0 00-3 3v5a3 3 0 006 0V3a3 3 0 00-3-3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function VideoOutlined(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      {...props}
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
    </svg>
  );
}

function VideoOff(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 640 512"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M633.8 458.1l-55-42.5c15.4-1.4 29.2-13.7 29.2-31.1v-257c0-25.5-29.1-40.4-50.4-25.8L448 177.3v137.2l-32-24.7v-178c0-26.4-21.4-47.8-47.8-47.8H123.9L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4L42.7 82 416 370.6l178.5 138c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.5-6.9 4.2-17-2.8-22.4zM32 400.2c0 26.4 21.4 47.8 47.8 47.8h288.4c11.2 0 21.4-4 29.6-10.5L32 154.7v245.5z" />
    </svg>
  );
}

function Call(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M436.9 364.8c-14.7-14.7-50-36.8-67.4-45.1-20.2-9.7-27.6-9.5-41.9.8-11.9 8.6-19.6 16.6-33.3 13.6-13.7-2.9-40.7-23.4-66.9-49.5-26.2-26.2-46.6-53.2-49.5-66.9-2.9-13.8 5.1-21.4 13.6-33.3 10.3-14.3 10.6-21.7.8-41.9C184 125 162 89.8 147.2 75.1c-14.7-14.7-18-11.5-26.1-8.6 0 0-12 4.8-23.9 12.7-14.7 9.8-22.9 18-28.7 30.3-5.7 12.3-12.3 35.2 21.3 95 27.1 48.3 53.7 84.9 93.2 124.3l.1.1.1.1c39.5 39.5 76 66.1 124.3 93.2 59.8 33.6 82.7 27 95 21.3 12.3-5.7 20.5-13.9 30.3-28.7 7.9-11.9 12.7-23.9 12.7-23.9 2.9-8.1 6.2-11.4-8.6-26.1z" />
    </svg>
  );
}

function EditIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 1024 1024"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z" />
    </svg>
  );
}

function OptionIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M9.5 13a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export {
  People,
  MicOff,
  MicOutlined,
  ChatOutlined,
  ChatActive,
  VideoOutlined,
  VideoOff,
  Call,
  EditIcon,
  OptionIcon,
};
