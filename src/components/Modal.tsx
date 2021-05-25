import React, { useEffect } from "react";

interface Props {
  children: JSX.Element;
  handleClose: () => void;
  isOpen: boolean;
}

export const Modal = (props: Props) => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.handleClose();
  };

  useEffect(() => {
    window.addEventListener("keyup", handleEscape);
    return () => {
      window.removeEventListener("keyup", handleEscape);
    };
  });

  return (
    <div
      className={`Modal transition-opacity duration-150 text-gray-900 fixed inset-0 flex items-center justify-center ${
        props.isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={() => props.handleClose()}
        className="absolute inset-0 bg-black bg-opacity-50"
        title="Close"
      ></div>
      <div
        className={`relative w-80 px-6 mx-auto transform duration-150  ${
          props.isOpen ? "translate-y-0" : "translate-y-5"
        }`}
      >
        {props.children}
      </div>
    </div>
  );
};
