import {
  BusinessAdditionalContactType,
  BusinessAuthorizationType,
  BusinessContactType,
  BusinessDeliveryType,
  BusinessDetailsType,
  CustomerFormType,
} from "./customer-form-schema";

export const businessDetails: BusinessDetailsType = {
  companyLegalName: "",
  companyType: "",
  companyDBA: "",
  ein: "",
  companyAddressStreet: "",
  companyAddressCity: "",
  companyAddressState: "",
  companyAddressZip: "",
  companyPhone: "",
};

export const businessContacts: BusinessContactType = {
  officerFirst: "",
  officerLast: "",
  officerTitle: "",
  officerMobile: "",
  officerEmail: "",
  homeAddressStreet: "",
  homeAddressCity: "",
  homeAddressState: "",
  homeAddressZip: "",
};

export const businessAdditionalContact: BusinessAdditionalContactType = {
  orderingName: "",
  orderingPhone: "",
  apEmail: "",
  guarantorName: "",
  guarantorTitle: "",
  salesRep: "",
};

export const businessDelivery: BusinessDeliveryType = {
  lockboxPermission: "",
  primaryDay: "",
  primaryWindow: "",
  secondaryDay: "",
  secondaryWindow: "",
  receivingName: "",
  receivingPhone: "",
  deliveryInstructions: "",
};

export const businessAuthorization: BusinessAuthorizationType = {
  resaleCertificate: null as any,
  dlFront: null as any,
  dlBack: null as any,
  signature: null as any,
  guarantorSignature: "",
  guaranteeAck: false,
};

export const defaultValues: CustomerFormType = {
  step: 0,
  ...businessDetails,
  ...businessContacts,
  ...businessAdditionalContact,
  ...businessContacts,
  ...businessDelivery,
  ...businessAuthorization,
};
