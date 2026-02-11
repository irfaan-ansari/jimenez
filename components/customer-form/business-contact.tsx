import { ROLES } from "./data";

import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";

import { businessContacts } from "@/lib/customer-form-values";

import translations from "@/data/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";

export const BusinessContact = withForm({
  defaultValues: businessContacts,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
        <form.AppField
          name="officerFirst"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="officerLast"
          children={(field) => <field.TextField label={t[field.name]} />}
        />

        <form.AppField
          name="officerTitle"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              options={ROLES}
              className="md:col-span-2"
            />
          )}
        />

        <form.AppField
          name="officerMobile"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="officerEmail"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="homeAddressStreet"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="homeAddressCity"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="homeAddressState"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="homeAddressZip"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
      </FieldGroup>
    );
  },
});
