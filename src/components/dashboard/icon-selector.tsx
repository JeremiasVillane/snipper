import { useMemo, useState } from "react";
import { iconOptions } from "@/data/shortlink-icons";
import { CircleX, Search } from "lucide-react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FixedSizeGrid as Grid } from "react-window";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IconSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const ICON_SIZE = 24; // px
const GAP = 8; // px
const COLUMNS = 4;
const CELL_SIZE = ICON_SIZE + GAP * 2.5;

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Precompute icon list
  const icons = useMemo(
    () => Object.entries(iconOptions).map(([name, Comp]) => ({ name, Comp })),
    [],
  );

  // Filtered icons based on search term
  const filtered = useMemo(
    () =>
      icons.filter(({ name }) =>
        name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [icons, search],
  );

  const rowCount = Math.ceil(filtered.length / COLUMNS);
  const width = COLUMNS * CELL_SIZE + 24;
  const height = 4 * CELL_SIZE; // show 4 rows

  const SelectedIcon = value ? iconOptions[value] : null;

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setSearch("");
      }}
    >
      <PopoverTrigger
        className={cn(
          "flex items-center justify-center rounded border p-2 hover:border-primary active:scale-95",
          open ? "border-primary text-primary" : "border-muted",
        )}
      >
        {SelectedIcon ? (
          <SelectedIcon className="size-5" />
        ) : (
          <iconOptions.default className="size-5" />
        )}
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="space-y-2.5 p-3 pb-1"
        style={{ width: width + 20 }}
      >
        <Input
          placeholder="Search icon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength={20}
          startIcon={<Search />}
          endIcon={
            search.length > 0 ? (
              <CircleX
                role="button"
                onClick={() => setSearch("")}
                className="hover:text-primary"
              />
            ) : undefined
          }
          className="h-8 w-full"
        />

        <Grid
          columnCount={COLUMNS}
          columnWidth={CELL_SIZE}
          height={height}
          rowCount={rowCount}
          rowHeight={CELL_SIZE}
          width={width}
        >
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * COLUMNS + columnIndex;
            if (index >= filtered.length) return null;

            const { name, Comp } = filtered[index];
            const selected = value === name || (!value && name === "default");

            return (
              <div style={style} className="flex items-center justify-center">
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-center rounded p-1 text-foreground/80",
                    selected
                      ? "border border-primary text-primary"
                      : "hover:border hover:border-primary hover:text-primary",
                  )}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  data-tooltip-id="icon-tooltip"
                  data-tooltip-content={name}
                >
                  <Comp className="size-5" />
                </button>
              </div>
            );
          }}
        </Grid>

        <ReactTooltip id="icon-tooltip" />
      </PopoverContent>
    </Popover>
  );
}
