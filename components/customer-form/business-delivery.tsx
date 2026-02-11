import { Textarea } from "../ui/textarea";
import { withForm } from "@/hooks/form-context";
import { DELIVERY_DAYS, DELIVERY_TIME } from "./data";
import { businessDelivery } from "@/lib/customer-form-values";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

import translations from "@/data/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";

export const BusinessDelivery = withForm({
  defaultValues: businessDelivery,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");

    return (
      <FieldGroup className="grid grid-cols-2">
        <form.AppField
          name="lockboxPermission"
          children={(field) => (
            <field.RadioField
              label={t[field.name]}
              className="col-span-2"
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
                { label: "In future", value: "future" },
              ]}
            />
          )}
        />
        <form.AppField
          name="primaryDay"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              options={DELIVERY_DAYS}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
        <form.AppField
          name="primaryWindow"
          children={(field) => (
            <field.SelectField
              options={DELIVERY_TIME}
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
        <form.AppField
          name="secondaryDay"
          children={(field) => (
            <field.SelectField
              options={DELIVERY_DAYS}
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
        <form.AppField
          name="secondaryWindow"
          children={(field) => (
            <field.SelectField
              options={DELIVERY_TIME}
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
        <form.AppField
          name="receivingName"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="receivingPhone"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.Field
          name="deliveryInstructions"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="col-span-2">
                <FieldLabel htmlFor={field.name}>{t[field.name]}</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-24 resize-none"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    );
  },
});
