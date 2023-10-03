import React, { useState } from "react";

export const ChecklistItems = ({ stepNumber, children }) => {
  return (
    <ul>
      {React.Children.map(children, (child, idx) => {
        const stepTodo = idx >= stepNumber;
        const className =
          stepNumber === idx ? "upNext" : stepNumber > idx ? "done" : "";
        return (
          <li key={idx} className={className}>
            <div className="progressionPath">
              <div className={`stepIndicator ${stepTodo ? "blue" : "green"}`}>
                {stepTodo ? (
                  idx + 1
                ) : (
                  <img src="checkmark.svg" alt="checkmark" />
                )}
              </div>
              {idx < React.Children.count(children) - 1 && (
                <div
                  className={`verticalLine ${stepTodo ? "blue" : "green"}`}
                ></div>
              )}
            </div>
            {child}
          </li>
        );
      })}
    </ul>
  );
};

export const AsyncButton = ({ children, onClick, disabled }) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className={disabled ? "disabled" : ""}
      onClick={async () => {
        if (disabled) return;
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
    >
      {loading ? <div className="loadingIndicator" /> : children}
    </button>
  );
};
