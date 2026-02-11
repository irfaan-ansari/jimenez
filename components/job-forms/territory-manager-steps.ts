import z from "zod";
import { ApplicantDetails } from "./applicant-details";
import {
  applicantAddressSchema,
  applicantSchema,
  authorizationSchema,
  educationSchema,
  employementSchema,
  licenseSchema,
} from "@/lib/job-form-schema";
import { ApplicantAddress } from "./applicant-address";
import { ApplicantLicense } from "./applicant-license";
import { ApplicantExperience } from "./applicant-experience";
import { ApplicantEducation } from "./applicant-education";
import { ApplicantConfirmation } from "./applicant-confirmation";

type StepsType = {
  title: string;
  description: string;
  component: React.ComponentType<any>;

  schema: z.ZodObject<any>;
}[];

export const steps: StepsType = [
  {
    title: "Applicant Information",
    description:
      "Provide your personal details so we can identify and contact you regarding your application.",
    component: ApplicantDetails,
    schema: applicantSchema,
  },
  {
    title: "Residence Address",
    description:
      "Provide your  residence address, including street, city, state, and ZIP code.",
    component: ApplicantAddress,
    schema: applicantAddressSchema,
  },
  {
    title: "License Information",
    description:
      "Enter your driver’s license details, including state of issue and expiration date.",
    component: ApplicantLicense,
    schema: licenseSchema,
  },
  {
    title: "Employment History",
    description:
      "Provide your employment history, including employers, job titles, and dates of employment.",
    component: ApplicantExperience,
    schema: employementSchema,
  },
  {
    title: "Education",
    description:
      "Enter your educational background, including highest level completed.",
    component: ApplicantEducation,
    schema: educationSchema,
  },
  {
    title: "Documents & Confirmation",
    description:
      "Upload your documents, verify all information is accurate, and confirm to complete your application.",
    component: ApplicantConfirmation,
    schema: authorizationSchema,
  },
];
