import { PaperCard } from "@/components/papers/PaperCard";
import { ClaimView } from "@/components/claims/ClaimView";
import { Unavailable } from "@/components/common/Unavailable";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { PaperCardSkeleton, AnalysisSkeleton } from "@/components/common/Skeletons";
import { MOCK_PAPERS } from "@/mocks/fixtures/papers";

export default function DevComponentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Paper Card</h2>
        <div className="grid max-w-3xl gap-4">
          <PaperCard paper={MOCK_PAPERS[0]} />
          <PaperCard paper={MOCK_PAPERS[1]} selected />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Claim Views</h2>
        <div className="grid max-w-3xl gap-4">
          <ClaimView
            claim={{
              kind: "sourced",
              text: "Extracted fact with valid sources.",
              sources: [{ paper_id: 1, section: "Intro", quote: "Valid quote" }],
            }}
          />
          <ClaimView
            claim={{
              kind: "sourced",
              text: "Extracted fact with MISSING sources (warning).",
              sources: [],
            }}
          />
          <ClaimView
            claim={{
              kind: "synthesis",
              text: "AI synthesis of multiple points.",
              sources: [],
            }}
          />
          <ClaimView
            claim={{
              kind: "inference",
              text: "AI inference / conclusion not explicitly in text.",
              sources: [],
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">States & Fallbacks</h2>
        <div className="grid max-w-3xl gap-8">
          <div>
            <h3 className="mb-2 font-medium">Unavailable</h3>
            <div className="rounded border p-4">
              <Unavailable />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Error</h3>
            <div className="rounded border p-4">
              <ErrorState message="Failed to load paper analysis" onRetry={() => {}} />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Empty</h3>
            <div className="rounded border p-4">
              <EmptyState title="No saved papers" description="Save papers to your library to see them here." />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Skeletons</h2>
        <div className="grid max-w-3xl gap-8">
          <PaperCardSkeleton />
          <AnalysisSkeleton />
        </div>
      </div>
    </div>
  );
}
