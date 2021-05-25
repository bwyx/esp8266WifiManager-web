import React from "react";

interface Props {
  secure: boolean;
  dbm: number;
}

enum Strength {
  EXCELLENT = 4,
  GOOD = 3,
  NORMAL = 2,
  LOW = 1,
  NONE = 0,
}

export const SignalStrength = ({ secure, dbm }: Props) => {
  const signal = () => {
    if (dbm >= -65) return Strength.EXCELLENT;
    else if (dbm >= -85) return Strength.GOOD;
    else if (dbm >= -100) return Strength.NORMAL;
    else if (dbm >= -110) return Strength.LOW;
    else return Strength.NONE;
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={
          signal() >= Strength.EXCELLENT ? "opacity-100" : "opacity-25"
        }
        d="M7.10614 22.106C7.10614 13.823 13.8222 7.10687 22.106 7.10616"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={signal() >= Strength.GOOD ? "opacity-100" : "opacity-25"}
        d="M12.1068 22.106C12.1061 16.5842 16.5835 12.1068 22.106 12.1068"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={signal() >= Strength.NORMAL ? "opacity-100" : "opacity-25"}
        d="M16.8133 22.3139C16.8134 20.8552 17.3928 19.4563 18.4243 18.4249C19.4557 17.3935 20.8546 16.814 22.3132 16.814"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.106 22.1068L22.113 22.0997"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {secure ? (
        <path
          d="M5.24238 1C6.77675 1 8.01136 2.20739 8.01136 3.698V4.46467C8.87253 4.73348 9.5 5.51307 9.5 6.4442V8.91265C9.5 10.0654 8.54432 11 7.36611 11H3.1344C1.95568 11 1 10.0654 1 8.91265V6.4442C1 5.51307 1.62797 4.73348 2.48864 4.46467V3.698C2.49372 2.20739 3.72833 1 5.24238 1ZM5.24746 6.69214C5.00359 6.69214 4.80544 6.88592 4.80544 7.12442V8.22747C4.80544 8.47093 5.00359 8.66471 5.24746 8.66471C5.49641 8.66471 5.69456 8.47093 5.69456 8.22747V7.12442C5.69456 6.88592 5.49641 6.69214 5.24746 6.69214ZM5.25254 1.86952C4.22116 1.86952 3.38285 2.68439 3.37776 3.68807V4.35685H7.12224V3.698C7.12224 2.68936 6.28392 1.86952 5.25254 1.86952Z"
          fill="white"
        />
      ) : null}
    </svg>
  );
};
