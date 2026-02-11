import { z } from "zod";
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export const step1Schema = z.object({
  companyLegalName: z.string().min(2, "Business name is required"),
  companyDBA: z.string().min(2, "Business DBA is required"),
  ein: z.string().min(2, "Business EIN is required"),
  companyAddressStreet: z.string().min(2, "Street address is required"),
  companyAddressCity: z.string().min(2, "City is required"),
  companyAddressState: z.string().min(2, "State is required"),
  companyAddressZip: z.string().min(2, "Zip code is required"),
  companyPhone: z
    .string()
    .min(1, "Phone is required")
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  // new field
  companyType: z.string().min(2, "Business type is required"),
});

export const step2Schema = z.object({
  officerFirst: z.string().min(2, "First name is required"),
  officerLast: z.string().min(2, "Last name is required"),
  officerTitle: z.string().min(2, "Title is required"),
  officerMobile: z
    .string()
    .min(1, "Phone is required")
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  officerEmail: z.email("Email is required"),
  homeAddressStreet: z.string().min(2, "Street address is required"),
  homeAddressCity: z.string().min(2, "City is required"),
  homeAddressState: z.string().min(2, "State is required"),
  homeAddressZip: z.string().min(2, "Zip code is required"),
});

export const step3Schema = z.object({
  orderingName: z.string().min(2, "Name is required"),
  orderingPhone: z
    .string()
    .min(1, "Phone is required")
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  apEmail: z.email("Email is required"),
  guarantorName: z.string().min(2, "Name is required"),
  guarantorTitle: z.string().min(2, "Title is required"),
  salesRep: z.string().optional(),
});

export const step4Schema = z.object({
  lockboxPermission: z.string().min(2, "Lockbox prefrence is required"),
  primaryDay: z.string().min(2, "Delivery day is required"),
  primaryWindow: z.string().min(2, "Delivery time is required"),
  secondaryDay: z.string().optional(),
  secondaryWindow: z.string().optional(),
  receivingName: z.string().min(2, "Name is required"),
  receivingPhone: z
    .string()
    .min(1, "Phone is required")
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  deliveryInstructions: z.string().min(2, "Instruction is required"),
});

export const step5Schema = z.object({
  guarantorSignature: z.string().min(2, "Signature name is required"),
  guaranteeAck: z.boolean().refine((val) => val === true, {
    message: "Guarantee agreement is required",
  }),
  // files
  resaleCertificate: z
    .file("Resale certificate is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 10MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  dlFront: z
    .file("Driver's licence is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 10MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  dlBack: z
    .file("Driver's licence is required")
    .max(MAX_UPLOAD_SIZE, "Upload file less tant 10MB")
    .mime(
      ["image/png", "image/jpeg", "application/pdf"],
      "File type is not allowed"
    ),
  signature: z
    .file("Signature is required")
    .mime(["image/png"], "File type is not allowed"),
});

export const customerSchema = z.object({
  step: z.number(),
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
});

export type BusinessDetailsType = z.infer<typeof step1Schema>;
export type BusinessContactType = z.infer<typeof step2Schema>;
export type BusinessAdditionalContactType = z.infer<typeof step3Schema>;
export type BusinessDeliveryType = z.infer<typeof step4Schema>;
export type BusinessAuthorizationType = z.infer<typeof step5Schema>;

export type CustomerFormType = z.infer<typeof customerSchema>;
