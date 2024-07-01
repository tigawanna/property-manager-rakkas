import type{ SchemaField } from "pocketbase";

export type TextFieldType = "text" | "number" | "email" | "url" | "date";
export type FieldType =
  | "text"
  | "editor"
  | "number"
  | "bool"
  | "email"
  | "url"
  | "date"
  | "select"
  | "relation"
  | "file"
  | "json";

export interface TextField extends SchemaField {
  type: "text";
  options: {
    min: number | null;
    max: number | null;
    pattern: string | null;
  };
}

export interface EditorField extends SchemaField {
  type: "editor";
  options: {
    exceptDomains: [];
    onlyDomains: [];
  };
}

export interface NumberField extends SchemaField {
  type: "number";
  options: {
    min: number | null;
    max: number | null;
  };
}

export interface BoolField extends SchemaField {
  type: "bool";
  options: {};
}

export interface EmailField extends SchemaField {
  type: "email";
  options: {
    exceptDomains: [] | null;
    onlyDomains: [] | null;
  };
}

export interface UrlField extends SchemaField {
  type: "url";
  options: {
    exceptDomains: [];
    onlyDomains: [];
  };
}

export interface DateField extends SchemaField {
  type: "date";
  options: {
    min: string;
    max: string;
  };
}

export interface SelectField<T extends Record<string, any>, K extends string>
  extends SchemaField {
  type: "select";
  fields: { label: string; value: T[K] }[];
  options: {
    maxSelect: number;
    values: string[];
  };
}

export interface RelationField<T extends Record<string, any>>
  extends SchemaField {
  type: "relation";
  filterBy: keyof T;

  options: {
    collectionId: string;
    cascadeDelete: boolean;
    minSelect: number | null;
    maxSelect: number;
    displayFields: string[] | null;
  };
}

export interface FileField extends SchemaField {
  type: "file";
  options: {
    maxSelect: number;
    maxSize: number;
    mimeTypes: string[];
    thumbs: string[] | null;
    protected: boolean;
  };
}

export interface JsonField extends SchemaField {
  type: "json";
  options: {
    maxSize: number;
  };
}

export type PBColumnField<T extends Record<string, any>, K extends string> =
  | TextField
  | EditorField
  | NumberField
  | BoolField
  | EmailField
  | UrlField
  | DateField
  | SelectField<T, K>
  | RelationField<T>
  | FileField
  | JsonField;
