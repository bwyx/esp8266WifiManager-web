import React from "react";
import { ICONS } from "../constants";

interface Props {
  icon: ICONS;
  className?: string;
}

export const Icon = (props: Props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={props.icon} fill="currentColor" />
    </svg>
  );
};
