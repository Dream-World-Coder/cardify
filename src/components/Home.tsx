import { useState, useRef } from "react";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";

interface Color {
  name: string;
  value: string;
}

type Alignment = "start" | "center" | "end";
type CardSize = 400 | 600 | 800;

type FontSize = 12 | 24 | 48;

export default function CardGenerator() {
  const [text, setText] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#ffcdd2");
  const [alignment, setAlignment] = useState<Alignment>("start");
  const [cardSize, setCardSize] = useState<CardSize>(600);
  const [fontSizeOption, setFontSizeOption] = useState<FontSize>(24);
  const cardRef = useRef<HTMLDivElement>(null);

  const colors: Color[] = [
    { name: "soft red", value: "#ffcdd2" },
    { name: "lime", value: "#e6f4d7" },
    { name: "blue", value: "#aac4f5" },
    { name: "orange", value: "#ffe5cc" },
    { name: "beige", value: "#f5f0e8" },
  ];

  const downloadCard = async () => {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 3, // HIGH QUALITY
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = "card.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-2xl md:text-3xl font-light text-neutral-800 mb-2">
            Cardify
          </h1>
          <p className="text-sm md:text-base text-neutral-500 font-light">
            Pause. Reflect. Create something thoughtful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-8">
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write something meaningful..."
                className="w-full h-24 p-4 border border-neutral-200 rounded-none focus:outline-none focus:border-neutral-400 resize-none text-neutral-800 placeholder-neutral-300 text-base md:text-lg font-light transition-colors"
                maxLength={600}
              />
              <div className="text-xs text-neutral-400 mt-2 text-right font-light">
                {text.length}/600
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-600 mb-3 font-light">
                Choose a color
              </label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className="group relative"
                    aria-label={color.name}
                  >
                    <div
                      className={`size-6 md:size-8 rounded-full transition-all ${
                        selectedColor === color.value
                          ? "ring-2 ring-offset-2 ring-neutral-400"
                          : "hover:ring-2 hover:ring-offset-2 hover:ring-neutral-200"
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-light">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-600 mb-3 font-light">
                Text alignment
              </label>
              <div className="flex gap-4">
                {[
                  { value: "start" as Alignment, label: "Left" },
                  { value: "center" as Alignment, label: "Center" },
                  { value: "end" as Alignment, label: "Right" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="alignment"
                      value={option.value}
                      checked={alignment === option.value}
                      onChange={(e) =>
                        setAlignment(e.target.value as Alignment)
                      }
                      className="w-3.5 h-3.5 text-neutral-800 border-neutral-300 focus:ring-1 focus:ring-neutral-400 cursor-pointer"
                    />
                    <span className="text-sm text-neutral-600 font-light group-hover:text-neutral-800 transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-600 mb-3 font-light">
                Font size
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="12"
                  max="64"
                  step="1"
                  value={fontSizeOption}
                  onChange={(e) =>
                    setFontSizeOption(parseInt(e.target.value) as FontSize)
                  }
                  className="w-full cursor-pointer"
                />

                <span className="text-sm text-neutral-700 font-light">
                  {fontSizeOption}px
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-600 mb-3 font-light">
                Export size
              </label>
              <div className="flex gap-4">
                {[400, 600, 800].map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="cardSize"
                      value={size}
                      checked={cardSize === size}
                      onChange={(e) =>
                        setCardSize(parseInt(e.target.value) as CardSize)
                      }
                      className="w-3.5 h-3.5 text-neutral-800 border-neutral-300 focus:ring-1 focus:ring-neutral-400 cursor-pointer"
                    />
                    <span className="text-sm text-neutral-600 font-light group-hover:text-neutral-800 transition-colors">
                      {size}×{size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={downloadCard}
              disabled={!text.trim()}
              className="w-full mt-8 px-6 py-4 bg-neutral-800 text-white rounded-none hover:bg-neutral-700 disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors flex items-center justify-center gap-2 text-sm md:text-base font-light disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Download card
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex- flex items-center justify-center bg-white p-6 md:p-8 border border-neutral-200">
              <div
                ref={cardRef}
                className={`w-full aspect-square flex p-8 transition-colors duration-300 ${
                  alignment === "center"
                    ? "items-center justify-center"
                    : alignment === "end"
                      ? "items-end justify-end"
                      : "items-start justify-start"
                }`}
                style={{ backgroundColor: selectedColor }}
              >
                {text ? (
                  <p
                    className={`text-black leading-relaxed font-light whitespace-pre-wrap wrap-break-words ${
                      alignment === "center"
                        ? "text-center"
                        : alignment === "end"
                          ? "text-right"
                          : "text-left"
                    }`}
                    style={{ fontSize: `${fontSizeOption}px` }}
                  >
                    {text}
                  </p>
                ) : (
                  <p className="text-black/40 text-base md:text-lg text-center font-light">
                    Your message will appear here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <p className="text-xs text-neutral-400 font-light"></p>
        </div>
      </div>
    </div>
  );
}
