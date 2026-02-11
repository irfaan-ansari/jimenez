"use client";

import { toast } from "sonner";
import {
  applicantAddress,
  applicantConfirmation,
  applicantDetail,
  applicantEducation,
  applicantExperience,
  applicantLicence,
} from "@/lib/job-form-values";
import { Button } from "../ui/button";
import { useStore } from "@tanstack/react-form";
import { steps } from "./territory-manager-steps";
import { useAppForm } from "@/hooks/form-context";
import { ArrowLeft, ArrowRight, Eye, Loader } from "lucide-react";
import { CareersFormType, driverFormSchema } from "@/lib/job-form-schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const defaultValues: CareersFormType = {
  ...applicantAddress,
  ...applicantConfirmation,
  ...applicantDetail,
  ...applicantEducation,
  ...applicantExperience,
  ...applicantLicence,
  step: 0,
  position: "",
};

export const TerritoryManagerForm = ({ position }: { position: string }) => {
  const form = useAppForm({
    defaultValues: {
      ...defaultValues,
      position,
    },
    validators: {
      onSubmit: ({ value, formApi }) => {
        return formApi.parseValuesWithSchema(
          steps[value.step as number].schema as typeof driverFormSchema
        );
      },
    },
    onSubmit: async ({ value, formApi }) => {
      if (value.step < steps.length - 1)
        formApi.setFieldValue("step", value.step + 1);
      else {
        await new Promise((res) => setTimeout(res, 2000));

        toast.success("Submitted", {
          description: <pre>{JSON.stringify(value)}</pre>,
        });

        formApi.reset();
      }
    },
  });

  const step = useStore(form.store, (state) => state.values.step);

  return (
    <Tabs value={step.toString()} onValueChange={(v) => console.log(v)}>
      <TabsList className="w-full bg-background gap-2 mb-8 p-0">
        {steps.map((s, i) => (
          <TabsTrigger
            key={s.title}
            value={step.toString()}
            className="justify-start h-auto p-0 shadow-none! group"
            data-completed={step >= i}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 group-data-[completed=true]:text-primary"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
            </svg>
            <span className="h-1 rounded-full flex-1 bg-muted-foreground relative after:absolute after:scale-x-0 after:inset-0 group-data-[completed=true]:after:scale-x-100 after:transition after:origin-left group-data-[completed=true]:after:bg-primary after:rounded-full" />
          </TabsTrigger>
        ))}
      </TabsList>

      <form
        className="mb-16 @container"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {steps.map((step, i) => (
          <TabsContent value={i.toString()} key={step.title}>
            <h4 className="text-xl font-semibold mb-1">{step.title}</h4>
            <p className="mb-4 text-muted-foreground">{step.description}</p>

            <step.component
              // @ts-ignore
              form={form}
            />
          </TabsContent>
        ))}

        {/* submit and preview */}
        <div className="flex gap-4 items-center justify-end mt-8">
          {/* previous button */}
          {step > 0 && step < steps.length && (
            <Button
              size="xl"
              className="min-w-32"
              type="button"
              variant="secondary"
              onClick={() => form.setFieldValue("step", step - 1)}
            >
              <ArrowLeft />
              Previous
            </Button>
          )}

          {/* preview button*/}
          {step === steps.length - 1 && (
            <Button
              size="xl"
              className="min-w-32"
              type="button"
              variant="secondary"
            >
              <Eye />
              Preview
            </Button>
          )}

          {/* submit button */}
          <form.Subscribe
            children={({ isSubmitting }) => (
              <Button size="xl" className="min-w-32" type="submit">
                {isSubmitting && step === steps.length - 1 && (
                  <Loader className="animate-spin" />
                )}
                {step < steps.length - 1 ? "Next" : "Submit"}
                {step < steps.length && <ArrowRight />}
              </Button>
            )}
          />
        </div>
      </form>
    </Tabs>
  );
};
