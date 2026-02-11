import z from "zod";

import {
  accidentHistorySchema,
  applicantSchema,
  authorizationSchema,
  drivingExperienceSchema,
  educationSchema,
  employementSchema,
  licenseSchema,
  applicantAddressSchema,
  trafficConvictionsSchema,
} from "@/lib/job-form-schema";
import { ApplicantDetails } from "./applicant-details";
import { ApplicantAddress } from "./applicant-address";
import { ApplicantLicense } from "./applicant-license";
import { ApplicantEducation } from "./applicant-education";
import { ApplicantExperience } from "./applicant-experience";
import { ApplicantConfirmation } from "./applicant-confirmation";
import { ApplicantAccidentHistory } from "./applicant-accident-history";
import { ApplicantDrivingExperience } from "./applicant-driving-experience";
import { ApplicantTrafficConvictions } from "./applicant-traffic-convistions";

export const US_STATES = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
  { label: "District of Columbia", value: "DC" },
];

export const CDL_CLASSES = [
  { label: "Non-CDL", value: "Non-CDL" },
  { label: "Class A", value: "A" },
  { label: "Class B", value: "B" },
  { label: "Class C", value: "C" },
];

export const CDL_ENDORSEMENTS = [
  { label: "None", value: "NONE" },
  { label: "Hazardous Materials (H)", value: "HAZMAT" },
  { label: "Tank Vehicle (N)", value: "TANKER" },
  { label: "Double / Triple Trailers (T)", value: "DOUBLE_TRIPLE" },
  { label: "Passenger (P)", value: "PASSENGER" },
  { label: "School Bus (S)", value: "SCHOOL_BUS" },
];

export const EQUEPMENT_CATGORIES = [
  { label: "Straight Truck", value: "STRAIGHT_TRUCK" },
  { label: "Tractor (Combination Vehicle)", value: "TRACTOR" },
  { label: "Bus / Passenger Vehicle", value: "BUS" },
  { label: "Other", value: "OTHER" },
];

export const EQUIPMENT_TYPES = [
  { label: "Van / Box Truck", value: "VAN_BOX", category: "STRAIGHT_TRUCK" },
  {
    label: "Flatbed Truck",
    value: "FLATBED_TRUCK",
    category: "STRAIGHT_TRUCK",
  },
  {
    label: "Tractor & Semi-Trailer",
    value: "SEMI_TRAILER",
    category: "TRACTOR",
  },
  {
    label: "Tractor & Double Trailers",
    value: "DOUBLE_TRAILERS",
    category: "TRACTOR",
  },
  { label: "Tractor & Tanker", value: "TANKER", category: "TRACTOR" },
  { label: "Passenger Bus", value: "PASSENGER_BUS", category: "BUS" },
  { label: "Other (Specify)", value: "OTHER", category: "OTHER" },
];

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
    title: "Driving Experience",
    description:
      "Share your commercial and non-commercial driving experience, including vehicle types and years driven.",
    component: ApplicantDrivingExperience,
    schema: drivingExperienceSchema,
  },
  {
    title: "Accident Records",
    description:
      "Report all accidents you have been involved in during the last three years.",
    component: ApplicantAccidentHistory,
    schema: accidentHistorySchema,
  },
  {
    title: "Traffic Convictions & Forfeitures",
    description:
      "Disclose any traffic violations, convictions, or bond forfeitures from the past three years.",
    component: ApplicantTrafficConvictions,
    schema: trafficConvictionsSchema,
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
