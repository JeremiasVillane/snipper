"use client";

import { useEffect, useRef, useState } from "react";
import { PlusCircle, Save, XCircle } from "lucide-react";
import { ZodIssue } from "zod";

import { UtmSetFormData, utmSetSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/simple-toast";

interface UtmSetFormProps {
  editingSet: UtmSetFormData | null;
  editingIndex: number | null;
  onAddSet: (data: UtmSetFormData) => void;
  onUpdateSet: (index: number, data: UtmSetFormData) => void;
  onCancelEdit: () => void;
}

const initialLocalState: UtmSetFormData = {
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
};

export function UtmSetForm({
  editingSet,
  editingIndex,
  onAddSet,
  onUpdateSet,
  onCancelEdit,
}: UtmSetFormProps) {
  const isEditing = editingIndex !== null && editingSet !== null;

  const [localData, setLocalData] = useState<UtmSetFormData>(initialLocalState);
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<keyof UtmSetFormData, string>>
  >({});
  const campaignInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setLocalData(editingSet);
      setLocalErrors({});

      campaignInputRef.current?.focus();
      campaignInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      setLocalData(initialLocalState);
    }
  }, [editingIndex, editingSet, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));

    if (localErrors[name as keyof UtmSetFormData]) {
      setLocalErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSaveOrAddClick = () => {
    const validationResult = utmSetSchema.safeParse(localData);

    if (!validationResult.success) {
      const newErrors: Partial<Record<keyof UtmSetFormData, string>> = {};
      validationResult.error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0] as keyof UtmSetFormData;
        if (field) newErrors[field] = issue.message;
      });
      setLocalErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please check the campaign fields.",
        type: "error",
      });
      return;
    }

    setLocalErrors({});

    if (isEditing) {
      onUpdateSet(editingIndex, validationResult.data);
    } else {
      onAddSet(validationResult.data);
    }

    if (!isEditing) setLocalData(initialLocalState);
  };

  return (
    <div
      className={`mt-4 space-y-4 rounded-md border p-4 ${
        isEditing
          ? "border-primary shadow-md ring-1 ring-primary"
          : "bg-muted/30"
      }`}
    >
      <h4 className="text-md mb-3 font-medium">
        {isEditing
          ? `Editing Campaign: ${editingSet?.campaign}`
          : "Add New Campaign Set"}
      </h4>

      <div className="space-y-1">
        <Label htmlFor="campaign">
          Campaign <span className="text-destructive">*</span>
        </Label>
        <Input
          ref={campaignInputRef}
          id="campaign"
          name="campaign"
          placeholder="e.g., summer_sale, newsletter_q3"
          value={localData.campaign}
          onChange={handleChange}
          aria-invalid={!!localErrors.campaign}
        />
        {localErrors.campaign && (
          <p className="mt-1 text-sm text-destructive">
            {localErrors.campaign}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            name="source"
            placeholder="e.g., facebook, google"
            value={localData.source ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="medium">Medium</Label>
          <Input
            id="medium"
            name="medium"
            placeholder="e.g., cpc, social"
            value={localData.medium ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="term">Term</Label>
          <Input
            id="term"
            name="term"
            placeholder="e.g., running+shoes"
            value={localData.term ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="content">Content</Label>
          <Input
            id="content"
            name="content"
            placeholder="e.g., logo_link"
            value={localData.content ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col justify-end gap-2 pt-2 md:flex-row">
        {isEditing && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            iconLeft={<XCircle className="size-4" />}
            onClick={onCancelEdit}
            className="w-full md:w-fit"
          >
            Cancel Edit
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          iconLeft={
            isEditing ? (
              <Save className="size-4" />
            ) : (
              <PlusCircle className="size-4" />
            )
          }
          onClick={handleSaveOrAddClick}
          className="w-full md:w-fit"
        >
          {isEditing ? "Update Set" : "Add This Set"}
        </Button>
      </div>
    </div>
  );
}
