import React from "react";

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contents: {
    backgroundColor: "white",
    padding: '8px'
  },
};

export function Modal({ children }: { children: React.ReactElement }) {
  return <div style={styles.root}>
    <div style={styles.contents}>{children}</div>
  </div>;
}
