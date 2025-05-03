"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/simple-toast";
import { UtmSetFormData, utmSetSchema } from "@/lib/schemas";
import { PlusCircle, Save, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ZodIssue } from "zod";
import { Label } from "../ui/label";

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
      className={`space-y-4 mt-4 p-4 border rounded-md ${
        isEditing
          ? "border-primary ring-1 ring-primary shadow-md"
          : "bg-muted/30"
      }`}
    >
      <h4 className="font-medium text-md mb-3">
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
          <p className="text-sm text-destructive mt-1">
            {localErrors.campaign}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="flex flex-col md:flex-row justify-end pt-2 gap-2">
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
