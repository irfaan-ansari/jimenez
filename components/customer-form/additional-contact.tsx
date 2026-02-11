import { FieldGroup } from "../ui/field";

import { withForm } from "@/hooks/form-context";
import { ROLES, SALES_REPRESENTATIVE } from "./data";

import { businessAdditionalContact } from "@/lib/customer-form-values";

import translations from "@/data/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";

export const BusinessAdditionalContact = withForm({
  defaultValues: businessAdditionalContact,
  render: function render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-2">
        <form.AppField
          name="orderingName"
          children={(field) => (
            <field.TextField label={t[field.name]} className="col-span-2" />
          )}
        />
        <form.AppField
          name="orderingPhone"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="apEmail"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <div className="col-span-2 ">
          <h4 className="text-xl font-semibold mb-1">Personal Guarantor</h4>
          <p className="text-muted-foreground">
            Enter the details of the individual who will personally guarantee
            payment on this account.
          </p>
        </div>
        <form.AppField
          name="guarantorName"
          children={(field) => <field.TextField label={t[field.name]} />}
        />

        <form.AppField
          name="guarantorTitle"
          children={(field) => (
            <field.SelectField
              options={ROLES}
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />

        <form.AppField
          name="salesRep"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              description={t[`${field.name}Desc`]}
              className="col-span-2"
              options={SALES_REPRESENTATIVE}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
      </FieldGroup>
    );
  },
});
