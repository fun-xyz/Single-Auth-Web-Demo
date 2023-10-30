import React, { useState } from "react";

export function ChecklistItems({ stepNumber, children }) {
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
                  <img
                    src="checkmark.svg"
                    alt="checkmark"
                    width={16}
                    height={16}
                  />
                )}
              </div>
              {idx < React.Children.count(children) - 1 && (
                <div
                  className={`verticalLine ${stepTodo ? "blue" : "green"}`}
                />
              )}
            </div>
            <div
              style={{
                marginTop: "-0.25rem",
                marginBottom: "0.75rem",
              }}
            >
              {child}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function AsyncButton({ onClick, disabled, title = "" }) {
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
      {loading ? <div className="loadingIndicator" /> : <p>{title}</p>}
    </button>
  );
}
