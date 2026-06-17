import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { gradeExplanation } from "@/lib/report.functions";
import {
  patchReportEntry,
  saveReportEntry,
  type ReportEntry,
} from "@/hooks/useReportStore";

type Params = {
  active: boolean; // true once the sub-case enters the "solved" stage
  caseId: string; // e.g. "case-01"
  subId: string; // e.g. "pizza"
  caseTitle: string; // e.g. "Case 01: Parts of a Whole"
  subTitle: string;
  emoji: string;
  glitchSummary: string;
  conceptMastered: string;
  studentQuotes: string[];
  marks: ReportEntry["marks"];
};

// Records a single judge-report entry on the first transition to "solved",
// then asks ZED-4 (Lovable AI) to grade the child's explanation.
export function useReportRecorder(p: Params) {
  const grade = useServerFn(gradeExplanation);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!p.active || savedRef.current) return;
    savedRef.current = true;

    const explanation =
      [...p.studentQuotes].sort((a, b) => b.length - a.length)[0] ?? "";

    const base: ReportEntry = {
      caseId: p.caseId,
      subId: p.subId,
      caseTitle: p.caseTitle,
      subTitle: p.subTitle,
      emoji: p.emoji,
      glitchSummary: p.glitchSummary,
      conceptMastered: p.conceptMastered,
      explanation,
      marks: p.marks,
      verdict: explanation ? "pending" : "review",
      verdictNote: explanation
        ? ""
        : "No explanation captured — replay this case to share your reasoning.",
      solvedAt: Date.now(),
    };
    saveReportEntry(base);

    if (!explanation) return;

    grade({
      data: {
        caseTitle: p.caseTitle,
        subTitle: p.subTitle,
        glitchSummary: p.glitchSummary,
        conceptMastered: p.conceptMastered,
        childExplanation: explanation,
      },
    })
      .then((res) => {
        patchReportEntry(p.caseId, p.subId, {
          verdict: res.verdict,
          verdictNote: res.note,
          understandingLevel: res.understandingLevel,
          strengths: res.strengths,
          gaps: res.gaps,
          nextStep: res.nextStep,
        });
      })
      .catch(() => {
        patchReportEntry(p.caseId, p.subId, {
          verdictNote: "ZED-4 couldn't grade this right now — try again later.",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.active]);
}
