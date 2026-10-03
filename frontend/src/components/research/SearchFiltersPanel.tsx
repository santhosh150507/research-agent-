"use client";

import { SearchFilters, SearchFacets } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  facets: SearchFacets | null;
}

export function SearchFiltersPanel({ filters, onChange, facets }: SearchFiltersPanelProps) {
  const updateArrayFilter = (key: keyof SearchFilters, value: string, checked: boolean) => {
    const current = (filters[key] as string[]) || [];
    const updated = checked ? [...current, value] : current.filter((v) => v !== value);
    onChange({ ...filters, [key]: updated.length > 0 ? updated : undefined });
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const renderFacetCheckboxes = (
    key: keyof SearchFilters, 
    items: { name: string; count: number }[] | undefined,
    title: string
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <AccordionItem value={key}>
        <AccordionTrigger className="text-sm py-2 hover:no-underline">{title}</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 pt-1">
            {items.map((item) => {
              const current = (filters[key] as string[]) || [];
              const isChecked = current.includes(item.name);
              return (
                <div key={item.name} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`facet-${key}-${item.name}`} 
                    checked={isChecked}
                    onCheckedChange={(c: boolean | "indeterminate") => updateArrayFilter(key, item.name, !!c)}
                  />
                  <Label htmlFor={`facet-${key}-${item.name}`} className="text-sm font-normal flex-1 cursor-pointer">
                    {item.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">{item.count}</span>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => onChange({})}>
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Year From</Label>
            <Input 
              type="number" 
              className="h-8 text-sm" 
              placeholder="e.g. 2018"
              value={filters.year_from || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, year_from: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Year To</Label>
            <Input 
              type="number" 
              className="h-8 text-sm" 
              placeholder="e.g. 2024"
              value={filters.year_to || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, year_to: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Min Citations</Label>
          <Input 
            type="number" 
            className="h-8 text-sm" 
            placeholder="e.g. 50"
            value={filters.min_citations || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, min_citations: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="filter-open-access" 
            checked={filters.open_access === true}
            onCheckedChange={(c: boolean | "indeterminate") => onChange({ ...filters, open_access: c === true ? true : undefined })}
          />
          <Label htmlFor="filter-open-access" className="text-sm font-normal cursor-pointer">
            Open Access Only
          </Label>
        </div>

        {facets && (
          <Accordion type="multiple" className="w-full mt-2" defaultValue={["methods", "topics"]}>
            {renderFacetCheckboxes("methods", facets.methods, "Methods")}
            {renderFacetCheckboxes("datasets", facets.datasets, "Datasets")}
            {renderFacetCheckboxes("topics", facets.topics, "Topics")}
            {renderFacetCheckboxes("venues", facets.venues, "Venues")}
          </Accordion>
        )}
      </div>
    </div>
  );
}
