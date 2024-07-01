import type { LiquorstoreProductsCreate, LiquorstoreProductsUpdate } from "@/lib/pb/database";
import { z } from "zod";

const MB_BYTES = 1000000; // Number of bytes in a megabyte.

// This is the list of mime types you will accept with the schema
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const CreateProductSchema: z.ZodType<LiquorstoreProductsCreate> = z.object({
  name: z.string(),
  abv: z.number(),
  availability: z.enum(["in_stock", "out_of_stock"]),
  description: z.string(),
  brand: z.string(),
  image: z.instanceof(File).superRefine((f, ctx) => {
    // First, add an issue if the mime type is wrong.
    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
          ", ",
        )}] but was ${f.type}`,
      });
    }
    // Next add an issue if the file size is too large.
    if (f.size > 3 * MB_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: "array",
        message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${
          f.size
        }`,
        maximum: 3 * MB_BYTES,
        inclusive: true,
      });
    }
  }),

  variant: z.array(
    z.object({
      price: z.number(),
      size: z.number(),
      quantity: z.number(),
    }),
  ),
});

export const UpdateProductSchema: z.ZodType<LiquorstoreProductsUpdate> = CreateProductSchema

