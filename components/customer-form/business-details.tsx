import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import { BUSINESS_TYPES } from "../customer-form/data";
import { businessDetails } from "@/lib/customer-form-values";
import translations from "@/data/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";

export const BusinessDetails = withForm({
  defaultValues: businessDetails,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
        <form.AppField
          name="companyLegalName"
          children={(field) => <field.TextField label={t[field.name]} />}
        />

        <form.AppField
          name="companyType"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              options={BUSINESS_TYPES}
            />
          )}
        />
        <form.AppField
          name="companyDBA"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="ein"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyAddressStreet"
          children={(field) => (
            <field.TextField label={t[field.name]} className="md:col-span-2" />
          )}
        />
        <form.AppField
          name="companyAddressCity"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyAddressState"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyAddressZip"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyPhone"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
      </FieldGroup>
    );
  },
});
