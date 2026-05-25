import { useState, useRef, useEffect } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn } from "../components/UI";
import { IMAGE_FILTERS } from "../constants/tools";

export default function ImageTool() {
  const [img, setImg] = useState(null);
  const [filter, setFilter] = useState("none");
  const [format, setFormat] = useState("image/png");
  const [drag, setDrag] = useState(false);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const load = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const image = new Image();
      image.onload = () => setImg({ src: ev.target.result, el: image, width: image.naturalWidth, height: image.naturalHeight, name: file.name, size: file.size });
      image.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = IMAGE_FILTERS[filter];
    ctx.drawImage(img.el, 0, 0);
  }, [img, filter]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL(format, 0.92);
    a.download = "ConvertLab." + format.split("/")[1];
    a.click();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) load(f);
  };

  return (
    <div className="tool-wrap">
      <ToolHeader title="Image Tools" desc="Convert, filter and transform images in the browser">
        {img && (
          <>
            <Btn onClick={() => setImg(null)}>Reset</Btn>
            <Btn primary onClick={download}>
              Download
            </Btn>
          </>
        )}
      </ToolHeader>

      {img && (
        <OptionsBar>
          <OptLabel>Convert to:</OptLabel>
          <OptGroup>
            {[
              ["image/png", "PNG"],
              ["image/jpeg", "JPEG"],
              ["image/webp", "WebP"],
            ].map(([v, l]) => (
              <OptBtn key={v} active={format === v} onClick={() => setFormat(v)}>
                {l}
              </OptBtn>
            ))}
          </OptGroup>
          <OptLabel style={{ marginLeft: "0.75rem" }}>Filter:</OptLabel>
          <OptGroup>
            {Object.entries({
              none: "None",
              ...Object.fromEntries(
                Object.keys(IMAGE_FILTERS)
                  .filter((k) => k !== "none")
                  .map((k) => [k, k[0].toUpperCase() + k.slice(1)]),
              ),
            }).map(([v, l]) => (
              <OptBtn key={v} active={filter === v} onClick={() => setFilter(v)}>
                {l}
              </OptBtn>
            ))}
          </OptGroup>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text3)" }}>
            {img.width}×{img.height} · {(img.size / 1024).toFixed(1)}KB
          </span>
        </OptionsBar>
      )}

      {!img ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            style={{
              border: `1.5px dashed ${drag ? "var(--accent)" : "var(--border2)"}`,
              borderRadius: 16,
              padding: "3rem 5rem",
              textAlign: "center",
              cursor: "pointer",
              color: drag ? "var(--text2)" : "var(--text3)",
              background: drag ? "rgba(124,109,255,0.04)" : "transparent",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⊞</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text2)", marginBottom: 4 }}>Drop image here or click to browse</div>
            <div style={{ fontSize: 12 }}>PNG, JPEG, WebP, GIF, SVG supported</div>
          </div>
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files[0]) load(e.target.files[0]);
            }}
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", gap: "1rem", padding: "1rem", overflow: "auto" }}>
          {[
            { label: "Original", content: <img src={img.src} alt="original" style={{ width: "100%", flex: 1, objectFit: "contain", background: "repeating-conic-gradient(var(--bg3) 0% 25%,var(--bg2) 0% 50%) 0 0/20px 20px" }} /> },
            { label: "Result", content: <canvas ref={canvasRef} style={{ width: "100%", flex: 1, objectFit: "contain", background: "repeating-conic-gradient(var(--bg3) 0% 25%,var(--bg2) 0% 50%) 0 0/20px 20px" }} /> },
          ].map(({ label, content }) => (
            <div key={label} style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "0.4rem 0.85rem", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", borderBottom: "1px solid var(--border)" }}>{label}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0.5rem" }}>{content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
