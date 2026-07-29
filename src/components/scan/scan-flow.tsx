"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Clipboard,
  Crop,
  Image as ImageIcon,
  Link2,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VisionProductResult } from "@/lib/vision";

type FlowStep = "upload" | "select" | "analyzing" | "confirm" | "not_recognized";

type DetectedProduct = VisionProductResult & { image: string; source: "ai" | "demo" };

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB = 15;
const MIN_CONFIDENCE = 40;
export const DEALLENS_STORAGE_KEY = "deallens:lastDetectedProduct";

const analysisSteps = [
  "Afbeelding analyseren",
  "Product herkennen",
  "Productdetails controleren",
  "Webshops doorzoeken",
  "Prijzen vergelijken",
  "Kortingscodes controleren",
  "Beste deal berekenen",
];

const demoFallbackProduct: DetectedProduct = {
  brand: "Nike",
  name: "Air Max 95 Essential",
  variant: "Heren sneaker",
  color: "Zwart",
  size: "42",
  category: "Schoenen",
  description:
    "Klassieke Nike Air Max 95 in de Essential-uitvoering, met gelaagd bovenwerk en zichtbare Air-zool.",
  confidence: 94,
  image: "https://placehold.co/600x600/101828/FFFFFF?text=Nike+Air+Max+95",
  source: "demo",
};

function buildDisplayName(brand: string, name: string): string {
  if (!brand) return name;
  const normalizedName = name.trim().toLowerCase();
  const normalizedBrand = brand.trim().toLowerCase();
  if (normalizedName === normalizedBrand || normalizedName.startsWith(`${normalizedBrand} `)) {
    return name;
  }
  return `${brand} ${name}`;
}

function fileToBase64(dataUrl: string): { base64: string; mimeType: string } {
  const [header, base64] = dataUrl.split(",");
  const mimeType = header.match(/data:(.*);base64/)?.[1] ?? "image/jpeg";
  return { base64, mimeType };
}

export function ScanFlow() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("upload");
  const [image, setImage] = useState<string | null>(null);
  const [isRealImage, setIsRealImage] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [selection, setSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [detected, setDetected] = useState<DetectedProduct | null>(null);
  const [notRecognizedReason, setNotRecognizedReason] = useState<string | null>(null);
  const [editableName, setEditableName] = useState("");
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragBoxRef = useRef<HTMLDivElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Alleen JPG, JPEG, PNG of WEBP-bestanden worden ondersteund.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`Het bestand is te groot. Maximaal ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setIsRealImage(true);
      setStep("select");
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleFiles([file]);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setIsRealImage(false);
    setSelection(null);
    setStep("upload");
    setFileError(null);
    setDetected(null);
    setNotRecognizedReason(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runAnalysis = useCallback(async () => {
    if (!image) return;

    if (!isRealImage) {
      // URL-gebaseerde flow: er is geen echte afbeelding om te analyseren, dus we tonen het demo-product.
      setDetected(demoFallbackProduct);
      setEditableName(`${demoFallbackProduct.brand} ${demoFallbackProduct.name}`);
      return;
    }

    try {
      const { base64, mimeType } = fileToBase64(image);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      const data = await response.json();

      if (!response.ok) {
        // TODO: debug-detail weer verwijderen zodra de vision-AI-koppeling stabiel draait.
        const reason = data.debug ? `${data.error} (debug: ${data.debug})` : data.error ?? "Product niet herkend.";
        setNotRecognizedReason(reason);
        setDetected(null);
        return;
      }

      const result = data as VisionProductResult;
      if (result.confidence < MIN_CONFIDENCE) {
        setNotRecognizedReason(
          `We zijn maar ${result.confidence}% zeker van deze herkenning, dat is te laag om een betrouwbaar resultaat te tonen.`
        );
        setDetected(null);
        return;
      }

      const finalProduct: DetectedProduct = { ...result, image, source: "ai" };
      setDetected(finalProduct);
      setEditableName(buildDisplayName(finalProduct.brand, finalProduct.name));
    } catch {
      setNotRecognizedReason(
        "Er ging iets mis bij het analyseren van je screenshot. Controleer je verbinding en probeer opnieuw."
      );
      setDetected(null);
    }
  }, [image, isRealImage]);

  const startAnalysis = () => {
    setNotRecognizedReason(null);
    setStep("analyzing");
  };

  const goToResults = () => {
    if (detected && typeof window !== "undefined") {
      window.sessionStorage.setItem(
        DEALLENS_STORAGE_KEY,
        JSON.stringify({ ...detected, name: editableName || `${detected.brand} ${detected.name}` })
      );
    }
    router.push("/results");
  };

  return (
    <div onPaste={onPaste} tabIndex={-1}>
      <ol className="mb-8 flex items-center justify-between gap-2 text-xs font-medium text-slate-400" aria-label="Voortgang">
        {["Upload", "Selecteer", "Analyse", "Bevestig"].map((label, i) => {
          const idx = ["upload", "select", "analyzing", "confirm"].indexOf(step);
          const done = i < idx;
          const activeIdx = i === idx;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px]",
                  done && "border-dl-green bg-dl-green text-white",
                  activeIdx && "border-dl-primary bg-white text-dl-primary",
                  !done && !activeIdx && "border-dl-border bg-white text-slate-300"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn(activeIdx || done ? "text-dl-text" : "text-slate-400")}>{label}</span>
              {i < 3 && <span className="mx-1 h-px flex-1 bg-dl-border" />}
            </li>
          );
        })}
      </ol>

      {step === "upload" && (
        <Card>
          <CardBody>
            <h1 className="text-2xl font-bold text-dl-navy">Upload een screenshot</h1>
            <p className="mt-1 text-sm text-slate-500">
              Sleep een afbeelding hierheen, klik om te selecteren, of plak een screenshot vanuit je klembord.
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>Upload geen screenshots met betaalgegevens, wachtwoorden of andere gevoelige informatie.</p>
            </div>

            <div
              ref={dragBoxRef}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload een screenshot door te klikken of te slepen"
              className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-dl-border bg-slate-50 px-6 py-14 text-center transition-colors hover:border-dl-primary hover:bg-blue-50/40"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Upload className="h-6 w-6 text-dl-primary" aria-hidden />
              </span>
              <p className="font-semibold text-dl-text">Sleep je screenshot hierheen</p>
              <p className="text-sm text-slate-500">of klik om een bestand te kiezen · JPG, JPEG, PNG, WEBP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="justify-center"
              >
                <ImageIcon className="h-4 w-4" /> Kies screenshot uit fotobibliotheek
              </Button>
              <Button type="button" variant="outline" onClick={() => dragBoxRef.current?.focus()} className="justify-center">
                <Clipboard className="h-4 w-4" /> Plak vanuit klembord
              </Button>
            </div>

            {fileError && (
              <p role="alert" className="mt-3 text-sm font-medium text-dl-error">
                {fileError}
              </p>
            )}

            <div className="mt-6 border-t border-dl-border pt-5">
              <label htmlFor="product-url" className="text-sm font-semibold text-dl-text">
                Of plak een link naar een productpagina
              </label>
              <div className="mt-2 flex gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-dl-border bg-white px-3">
                  <Link2 className="h-4 w-4 text-slate-400" aria-hidden />
                  <input
                    id="product-url"
                    type="url"
                    inputMode="url"
                    placeholder="https://voorbeeldwinkel.nl/product/123"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="w-full py-2.5 text-sm outline-none"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!productUrl}
                  onClick={() => {
                    setImage("https://placehold.co/700x700/101828/FFFFFF?text=Productpagina");
                    setIsRealImage(false);
                    setStep("select");
                  }}
                >
                  Gebruik URL
                </Button>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Bij een URL kan de AI de pagina nog niet live ophalen; we tonen dan een voorbeeldresultaat.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {step === "select" && image && (
        <SelectStep
          image={image}
          selection={selection}
          setSelection={setSelection}
          onRemove={removeImage}
          onConfirm={startAnalysis}
        />
      )}

      {step === "analyzing" && (
        <AnalyzingStep
          run={runAnalysis}
          onDone={() => setStep((prev) => (prev === "analyzing" ? "confirm" : prev))}
        />
      )}

      {step === "confirm" && image && detected && (
        <ConfirmStep
          detected={detected}
          editableName={editableName}
          setEditableName={setEditableName}
          editing={editing}
          setEditing={setEditing}
          onConfirm={goToResults}
          onReject={() => setEditing(true)}
        />
      )}

      {step === "confirm" && !detected && (
        <NotRecognizedCard
          reason={notRecognizedReason}
          onRetry={removeImage}
          onManual={() => {
            const manual: DetectedProduct = {
              brand: "",
              name: "",
              variant: "",
              color: "",
              size: null,
              category: "",
              description: "Handmatig ingevoerd product.",
              confidence: 0,
              image: image ?? demoFallbackProduct.image,
              source: "demo",
            };
            setDetected(manual);
            setEditableName("");
            setEditing(true);
          }}
        />
      )}
    </div>
  );
}

function NotRecognizedCard({
  reason,
  onRetry,
  onManual,
}: {
  reason: string | null;
  onRetry: () => void;
  onManual: () => void;
}) {
  return (
    <Card>
      <CardBody className="text-center">
        <h2 className="text-xl font-bold text-dl-text">Product niet herkend</h2>
        <p className="mt-2 text-sm text-slate-600">
          {reason ??
            "We konden het product niet met voldoende zekerheid herkennen. Probeer een duidelijkere afbeelding of selecteer alleen het product."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={onRetry}>
            Andere afbeelding uploaden
          </Button>
          <Button onClick={onManual}>Product handmatig invoeren</Button>
        </div>
      </CardBody>
    </Card>
  );
}

function SelectStep({
  image,
  selection,
  setSelection,
  onRemove,
  onConfirm,
}: {
  image: string;
  selection: { x: number; y: number; w: number; h: number } | null;
  setSelection: (s: { x: number; y: number; w: number; h: number } | null) => void;
  onRemove: () => void;
  onConfirm: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  const getRelativePos = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(0, e.clientX - rect.left), rect.width),
      y: Math.min(Math.max(0, e.clientY - rect.top), rect.height),
    };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const pos = getRelativePos(e);
    setStart(pos);
    setDragging(true);
    setSelection({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !start) return;
    const pos = getRelativePos(e);
    setSelection({
      x: Math.min(start.x, pos.x),
      y: Math.min(start.y, pos.y),
      w: Math.abs(pos.x - start.x),
      h: Math.abs(pos.y - start.y),
    });
  };

  const onMouseUp = () => setDragging(false);

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dl-navy">Selecteer het product dat je wilt zoeken</h1>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" /> Verwijderen
          </Button>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Crop className="h-4 w-4" /> Sleep een kader om het gewenste product te plaatsen.
        </p>

        <div
          ref={containerRef}
          className="relative mt-4 select-none overflow-hidden rounded-xl border border-dl-border bg-slate-900"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <img src={image} alt="Geüploade screenshot" className="max-h-[420px] w-full object-contain" draggable={false} />
          {selection && (
            <div
              className="absolute border-2 border-dl-primary bg-blue-400/10"
              style={{ left: selection.x, top: selection.y, width: selection.w, height: selection.h }}
            />
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <Button variant="outline" onClick={() => setSelection(null)}>
            Gebruik volledige afbeelding
          </Button>
          <Button onClick={onConfirm}>Start AI-analyse</Button>
        </div>
      </CardBody>
    </Card>
  );
}

function AnalyzingStep({ run, onDone }: { run: () => Promise<void>; onDone: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let i = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const advance = () => {
      i += 1;
      if (!cancelled) setActiveIndex(i);
      if (i < analysisSteps.length) {
        timeoutId = setTimeout(advance, 500);
      }
    };
    timeoutId = setTimeout(advance, 500);

    const minDuration = new Promise((resolve) => setTimeout(resolve, analysisSteps.length * 500));

    Promise.all([run(), minDuration]).then(() => {
      if (!cancelled) onDone();
    });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardBody className="text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="dl-pulse-ring absolute h-20 w-20 rounded-full bg-dl-primary/30" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-dl-primary text-white">
            <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
          </span>
        </div>
        <h1 className="mt-6 text-xl font-bold text-dl-navy">DealLens AI analyseert je screenshot…</h1>
        <p className="mt-1 text-sm text-slate-500">We controleren meerdere bronnen om de beste deal te vinden.</p>

        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left" aria-live="polite">
          {analysisSteps.map((label, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active && "bg-blue-50 font-semibold text-dl-primary",
                  done && "text-slate-400"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                    done && "border-dl-green bg-dl-green text-white",
                    active && "border-dl-primary text-dl-primary",
                    !done && !active && "border-dl-border text-slate-300"
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : active ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
                </span>
                {label}
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}

function ConfirmStep({
  detected,
  editableName,
  setEditableName,
  editing,
  setEditing,
  onConfirm,
  onReject,
}: {
  detected: DetectedProduct;
  editableName: string;
  setEditableName: (v: string) => void;
  editing: boolean;
  setEditing: (v: boolean) => void;
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <Card className="dl-fade-up">
      <CardBody>
        <Badge tone={detected.source === "ai" ? "blue" : "gray"} className="mb-3">
          {detected.source === "ai" ? "AI-analyse" : "Demo-resultaat"}
        </Badge>
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <img
            src={detected.image}
            alt={`${detected.brand} ${detected.name}`}
            className="h-52 w-full rounded-xl object-cover md:h-full"
          />
          <div>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500" htmlFor="edit-name">
                    Productnaam
                  </label>
                  <input
                    id="edit-name"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-dl-border px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Merk</label>
                    <input defaultValue={detected.brand} className="mt-1 w-full rounded-lg border border-dl-border px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Modelnummer</label>
                    <input placeholder="Optioneel" className="mt-1 w-full rounded-lg border border-dl-border px-3 py-2 text-sm" />
                  </div>
                </div>
                <Button size="sm" onClick={() => setEditing(false)}>
                  Opslaan
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-dl-text">{editableName}</h1>
                <p className="text-sm text-slate-500">
                  {detected.color} {detected.size ? `· Maat ${detected.size}` : ""} · {detected.category}
                </p>
                <p className="mt-3 text-sm text-slate-600">{detected.description}</p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 max-w-40 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-dl-green"
                      style={{ width: `${detected.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-dl-green">
                    Herkenningszekerheid: {detected.confidence}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {!editing && (
          <div className="mt-6 border-t border-dl-border pt-5">
            <p className="font-semibold text-dl-text">Is dit het juiste product?</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button onClick={onConfirm}>Ja, zoek de beste deal</Button>
              <Button variant="outline" onClick={onReject}>
                Nee, product aanpassen
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
