import { useEffect, useState } from "react";

export const EncryptedLog = () => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const generateHex = () =>
      Array(Math.floor(Math.random() * 10) + 4)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")
        .toUpperCase();

    const generateLogLine = () => {
      const timestamps = new Date().toISOString();
      const codes = ["AUTH", "VRFY", "SYNC", "PING", "DATA", "ENCR"];
      const code = codes[Math.floor(Math.random() * codes.length)];
      return `[${timestamps}] :: ${code} :: 0x${generateHex()}...${generateHex()}`;
    };

    // Fill initial buffer
    const initialLines = Array(20)
      .fill(0)
      .map(generateLogLine);
    setLines(initialLines);

    const interval = setInterval(() => {
      setLines((prev) => [...prev.slice(1), generateLogLine()]);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="encrypted-log"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        opacity: 0.15,
        pointerEvents: "none",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        color: "#00f2ff",
        zIndex: 0,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {line}
        </div>
      ))}
    </div>
  );
};
