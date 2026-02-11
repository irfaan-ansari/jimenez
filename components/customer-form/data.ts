import React from "react";
import { z } from "zod";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "@/lib/customer-form-schema";
import { BusinessDelivery } from "./business-delivery";
import { Authorization } from "./business-authorization";
import { BusinessDetails } from "./business-details";
import { BusinessContact } from "./business-contact";
import { BusinessAdditionalContact } from "./additional-contact";

/**
 * constants
 */
export const BUSINESS_TYPES = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Retail", value: "retail" },
  { label: "Health Care", value: "health_care" },
  { label: "Education", value: "education" },
  { label: "Food Truck", value: "food_truck" },
  { label: "Other", value: "other" },
];

export const ROLES = [
  { label: "Owner", value: "owner" },
  { label: "Management", value: "management" },
  { label: "Chef / Culinary / Accounting", value: "chef_culinary_accounting" },
  { label: "Marketing", value: "marketing" },
  { label: "CEO", value: "ceo" },
  { label: "CFO", value: "cfo" },
  { label: "VP", value: "vp" },
  { label: "Other", value: "other" },
];
export const SALES_REPRESENTATIVE = [
  { label: "Elizabeth", value: "Elizabeth" },
  { label: "Jorge", value: "Jorge" },
  { label: "Yhessenia", value: "Yhessenia" },
  { label: "Other", value: "Other" },
];

export const DELIVERY_DAYS = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

export const DELIVERY_TIME = [
  {
    label: "6:00 AM – 9:00 AM",
    value: "06:00-09:00",
  },
  {
    label: "9:00 AM – 12:00 PM",
    value: "09:00-12:00",
  },
  {
    label: "12:00 PM – 3:00 PM",
    value: "12:00-15:00",
  },
  {
    label: "3:00 PM – 6:00 PM",
    value: "15:00-18:00",
  },
  {
    label: "6:00 PM – 9:00 PM",
    value: "18:00-21:00",
  },
  { label: "Anytime", value: "anytime" },
];

type StepConfig = {
  title: string;
  description: string;
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
};

export const steps: StepConfig[] = [
  {
    title: "title1",
    description: "desc1",
    component: BusinessDetails,
    schema: step1Schema,
  },
  {
    title: "title2",
    description: "desc2",
    component: BusinessContact,
    schema: step2Schema,
  },
  {
    title: "title3",
    description: "desc3",
    component: BusinessAdditionalContact,
    schema: step3Schema,
  },
  {
    title: "title4",
    description: "desc4",
    component: BusinessDelivery,
    schema: step4Schema,
  },

  {
    title: "title5",
    description: "desc5",
    component: Authorization,
    schema: step5Schema,
  },
];
