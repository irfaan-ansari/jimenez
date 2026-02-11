"use server";

import { cookies } from "next/headers";
import { CustomerFormType } from "@/lib/customer-form-schema";

export const submitContactAction = async () => {
  const cookieStore = await cookies();

  cookieStore.set("catalog", "true", {
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 10,
  });

  return await new Promise((res) => setTimeout(res, 2000));
};

export const submitJobApplicationAction = async () => {
  return await new Promise((res) => setTimeout(res, 2000));
};

export const customerApplicationAction = async (data: CustomerFormType) => {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbw6i9mfbKJUQ1L49jetXJTAF52BgYd8HHdToYr3UqbVUjGpFEpmo-Eu1DzqHUua-tum/exec",
    {
      method: "post",
      body: JSON.stringify(data),
    }
  );
  const json = await res.json();
  console.log(json);

  // const res = await safeFetch("url", data);
  return await new Promise((res) => setTimeout(res, 2000));
};
