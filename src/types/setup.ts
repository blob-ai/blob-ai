export type ContentSetup = {
  id: string;
  name: string;
  goal?: string;
  format?: string;
  hook?: string;
  tone?: string;
  examples?: { name: string; content: string }[];
  isTemplate?: boolean;
  detectedVariables?: TemplateVariable[];
};

export type SetupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultValue?: string;
};

export type TemplateVariable = {
  name: string;
  value: string;
  occurrences: number;
  label: string;
  description: string;
};

export type TemplateExtractionMode = "auto" | "manual";
