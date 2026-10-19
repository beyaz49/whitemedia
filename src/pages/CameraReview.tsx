import { useState } from "react";
import CameraIntro from "@/components/CameraIntro";

export default function CameraReview() {
  const [time, setTime] = useState(1.3);
  const [phone, setPhone] = useState(false);
  const button = { border: "1px solid #ccc", padding: "10px 14px", background: "#fff", color: "#111", borderRadius: 5, cursor: "pointer", font: "inherit" };
  return (
    <main style={{ padding: 20, background: "#e9e9e6", color: "#111", minHeight: "100vh", fontSize: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <strong>White Media · Açılış kontrolü</strong>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[[0, "Başlangıç"], [1.3, "Yaklaşma"], [2.48, "Kilitlenme"], [3.25, "Birleşik"], [4.15, "Logo"]].map(([seconds, title]) => (
            <button key={title} style={button} aria-pressed={time === seconds} onClick={() => setTime(Number(seconds))}>{title}</button>
          ))}
          <button style={button} aria-pressed={!phone} onClick={() => setPhone(false)}>Masaüstü</button>
          <button style={button} aria-pressed={phone} onClick={() => setPhone(true)}>Telefon 390 px</button>
        </div>
      </div>
      <div data-testid="camera-review-viewport" style={{ width: phone ? 390 : 1120, maxWidth: "100%", height: phone ? 780 : 650, position: "relative", margin: "0 auto", overflow: "hidden", borderRadius: phone ? 20 : 3, boxShadow: "0 8px 35px #0002" }}>
        <CameraIntro reviewTime={time} />
      </div>
    </main>
  );
}
