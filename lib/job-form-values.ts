import {
  ApplicantAccidentHistoryType,
  ApplicantAddressType,
  ApplicantAuthorizationType,
  ApplicantDetailsType,
  ApplicantDrivingExperienceType,
  ApplicantEducationType,
  ApplicantEmployementType,
  ApplicantLicenseType,
} from "./job-form-schema";

const applicantDetail: ApplicantDetailsType = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  socialSecurity: "",
  availableStartDate: "",
  hasLegalRights: "yes",
};
const applicantAddress: ApplicantAddressType = {
  currentAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
    yearsAtAddress: "",
  },
  mailingAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
    yearsAtAddress: "",
  },
  addresses: [],
};
const applicantLicence: ApplicantLicenseType = {
  currentLicense: {
    state: "",
    licenseType: "",
    licenseNumber: "",
    endorsements: "",
    expiryDate: "",
  },
  licenses: [],
};

const applicantExperience: ApplicantEmployementType = {
  experience: [
    {
      employerName: "",
      phone: "",
      address: "",
      position: "",
      fromDate: "",
      toDate: "",
      reasonForLeaving: "",
      safetySensitive: "",
      subjectToFmcsa: "",
      gap: "",
      salary: "",
    },
  ],
};
const applicantEducation: ApplicantEducationType = {
  highSchool: {
    institutionName: "",
    fieldOfStudy: "",
    location: "",
    yearCompleted: "",
    details: "",
  },
  collage: {
    institutionName: "",
    fieldOfStudy: "",
    location: "",
    yearCompleted: "",
    details: "",
  },
  educations: [
    {
      institutionName: "",
      fieldOfStudy: "",
      location: "",
      yearCompleted: "",
      details: "",
    },
  ],
};

const applicantConfirmation: ApplicantAuthorizationType = {
  applicantName: "",
  declaration: false,
  drivingLicenseBack: undefined as any,
  drivingLicenseFront: undefined as any,
  socialSecurityBack: undefined as any,
  socialSecurityFront: undefined as any,
  dotFront: undefined as any,
  dotBack: undefined as any,
  signature: undefined as any,
};

const applicantDrivingExperience: ApplicantDrivingExperienceType = {
  drivingExperiences: [
    {
      category: "",
      type: "",
      fromDate: "",
      toDate: "",
      approxMilesTotal: "",
    },
  ],
};

const applicantAccidentHistory: ApplicantAccidentHistoryType = {
  accidentHistory: [
    {
      accidentDate: "",
      accidentNature: "",
      injuriesCount: "",
      fatalitiesCount: "",
      chemicalSpill: "",
    },
  ],
};

const applicantTrafficConvictions = {
  trafficConvictions: [
    {
      dateConvicted: "",
      violation: "",
      state: "",
      penalty: "",
      licenseDenied: "",
      licenseDeniedReason: "",
      licenseSuspended: "",
      licenseSuspendedReason: "",
    },
  ],
};

export {
  applicantDetail,
  applicantAddress,
  applicantAccidentHistory,
  applicantConfirmation,
  applicantDrivingExperience,
  applicantEducation,
  applicantExperience,
  applicantLicence,
  applicantTrafficConvictions,
};
