import { useEffect, useRef, useState } from "react";
import { Circle, Eraser, Highlighter, NotebookPen, Undo2, X } from "lucide-react";

type Mark = { kind: "circle" | "shade" | "cross"; x: number; y: number };

type Props = {
  caseNumber: string;
  title: string;
  zedClaim: string;
  storageId: string;
};

export function WorkbookCaseTools({ caseNumber, title, zedClaim, storageId }: Props) {
  const key = `gd:workbook:${storageId}`;
  const [notes, setNotes] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [tool, setTool] = useState<Mark["kind"]>("circle");
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(key) ?? "null") as
        | { notes?: string; evidence?: string[]; marks?: Mark[] }
        | null;
      if (saved) {
        setNotes(saved.notes ?? "");
        setEvidence(saved.evidence ?? []);
        setMarks(saved.marks ?? []);
      }
    } catch {
      // A damaged draft should never stop a child opening the case file.
    }
    loaded.current = true;
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    window.localStorage.setItem(key, JSON.stringify({ notes, evidence, marks }));
  }, [evidence, key, marks, notes]);

  const saveEvidence = () => {
    const item = notes.trim();
    if (!item || evidence.includes(item)) return;
    setEvidence((items) => [...items, item]);
    setNotes("");
  };

  return (
    <div className="workbook-intro">
      <div className="workbook-case-heading">
        <div>
          <p className="workbook-kicker">CASE FILE #{caseNumber}</p>
          <h2>Investigate ZED-4&apos;s Work</h2>
          <p className="workbook-case-name">{title}</p>
        </div>
        <div className="workbook-stamp">OPEN CASE</div>
      </div>

      <blockquote className="workbook-claim">
        <span>ZED-4 says:</span>
        “{zedClaim}”
      </blockquote>

      <section className="workbook-notes" aria-labelledby={`${storageId}-notes`}>
        <div className="workbook-section-title">
          <span>01</span>
          <div>
            <h3 id={`${storageId}-notes`}>What do you notice?</h3>
            <p>Write a detective note before choosing your verdict.</p>
          </div>
        </div>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="I notice that…"
          rows={3}
          className="workbook-note-input"
        />
        <button type="button" onClick={saveEvidence} disabled={!notes.trim()} className="workbook-save-evidence">
          <NotebookPen size={16} /> Save as evidence
        </button>
        {evidence.length > 0 && (
          <div className="workbook-evidence-tray">
            <strong>Evidence collected</strong>
            {evidence.map((item, index) => (
              <div key={`${item}-${index}`}>
                <span>{index + 1}</span>
                <p>{item}</p>
                <button type="button" aria-label={`Remove evidence ${index + 1}`} onClick={() => setEvidence((items) => items.filter((_, i) => i !== index))}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="workbook-annotation" aria-label="Annotation practice area">
        <div className="workbook-section-title">
          <span>02</span>
          <div>
            <h3>Mark your evidence</h3>
            <p>Circle, shade, or cross out a clue, then find it in ZED-4&apos;s model below.</p>
          </div>
        </div>
        <div className="workbook-tool-row">
          {([
            ["circle", Circle, "Circle"],
            ["shade", Highlighter, "Shade"],
            ["cross", X, "Cross out"],
          ] as const).map(([kind, Icon, label]) => (
            <button type="button" key={kind} aria-pressed={tool === kind} onClick={() => setTool(kind)}>
              <Icon size={16} /> {label}
            </button>
          ))}
          <button type="button" onClick={() => setMarks((items) => items.slice(0, -1))} disabled={!marks.length}>
            <Undo2 size={16} /> Undo
          </button>
          <button type="button" onClick={() => setMarks([])} disabled={!marks.length}>
            <Eraser size={16} /> Clear
          </button>
        </div>
        <div
          className="workbook-marking-pad"
          onClick={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            setMarks((items) => [...items, { kind: tool, x: event.clientX - box.left, y: event.clientY - box.top }]);
          }}
        >
          <span>Tap here to practise marking the suspicious part</span>
          {marks.map((mark, index) => (
            <i key={index} className={`workbook-mark workbook-mark-${mark.kind}`} style={{ left: mark.x, top: mark.y }} />
          ))}
        </div>
      </section>

      <div className="workbook-section-title workbook-find-title">
        <span>03</span>
        <div><h3>Find the Glitch</h3><p>Study the large model and decide whether ZED-4&apos;s reasoning is correct.</p></div>
      </div>
    </div>
  );
}