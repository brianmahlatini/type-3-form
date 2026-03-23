import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./components/ui/Button";
import { Card, CardContent, CardHeader } from "./components/ui/Card";
import { Field } from "./components/ui/Field";
import { Input } from "./components/ui/Input";
import { Select } from "./components/ui/Select";
import { Spinner } from "./components/ui/Spinner";
import { FileUpload } from "./components/FileUpload";
import { DatePickerInput } from "./components/DatePickerInput";

const MAX_BYTES = 10 * 1024 * 1024;

const CAUSES = ["Natural", "Stillborn", "Under Investigation", "Un-natural"] as const;

const causeOfDeathSchema = z
  .string()
  .trim()
  .min(1, "Cause of death is required.")
  .refine((v) => (CAUSES as readonly string[]).includes(v), "Invalid cause of death.");

const schema = z.object({
  mainMemberId: z.string().trim().optional(),
  policyNumber: z.string().trim().optional(),
  deceasedId: z.string().trim().optional(),
  causeOfDeath: causeOfDeathSchema,
  beneficiaryFirstName: z.string().trim().min(1, "Beneficiary first name is required."),
  beneficiarySurname: z.string().trim().optional(),
  beneficiaryIdNumber: z.string().trim().optional(),
  beneficiaryAccountNumber: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  accountType: z.string().trim().optional(),
  contactEmail: z.string().trim().email("Enter a valid email.").optional().or(z.literal("")),
  dateOfDeath: z.string().trim().optional(),
  documents: z
    .custom<File | null>()
    .optional()
    .refine((f) => !f || f.size <= MAX_BYTES, `Document must be ${Math.round(MAX_BYTES / 1024 / 1024)}MB or less.`),
});

type FormValues = z.infer<typeof schema>;

const BANKS = [
  "ABN AMRO BANK",
  "ABSA",
  "ALBARAKA BANK",
  "BANK OF ATHENS",
  "CAPITEC BANK",
  "CITIBANK",
  "FNB",
  "INVESTEC",
  "NBS",
  "NEDBANK (CHQ ACCOUNT ONLY)",
  "NEDBANK (SAVINGS ACCOUNT ONLY)",
  "PEP BANK",
  "STANDARD BANK",
  "STATE BANK OF INDIA",
  "TYMEBANK OF TYMEBANK LTD",
  "BANK ZERO",
  "BNP PARIBAS SA",
  "DISCOVERY BANK LTD",
  "FINBOND MUTUAL BANK",
  "HSBC BANK",
  "J.P.MORGAN CHASE BANK",
  "SASFIN BANK LIMITED",
  "SOCIETE GENERALE BANK",
] as const;

const ACCOUNT_TYPES = ["Savings", "Current", "Cheque"] as const;

export default function App() {
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const defaultValues: FormValues = useMemo(
    () => ({
      mainMemberId: "",
      policyNumber: "",
      deceasedId: "",
      causeOfDeath: "",
      beneficiaryFirstName: "",
      beneficiarySurname: "",
      beneficiaryIdNumber: "",
      beneficiaryAccountNumber: "",
      bankName: "",
      accountType: "",
      contactEmail: "",
      dateOfDeath: "",
      documents: null,
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const dateOfDeath = watch("dateOfDeath");

  async function onSubmit(values: FormValues) {
    setSubmitState("submitting");
    setSubmitMessage("");

    try {
      const formData = new FormData();
      formData.set("mainMemberId", values.mainMemberId || "");
      formData.set("policyNumber", values.policyNumber || "");
      formData.set("deceasedId", values.deceasedId || "");
      formData.set("causeOfDeath", values.causeOfDeath);
      formData.set("beneficiaryFirstName", values.beneficiaryFirstName);
      formData.set("beneficiarySurname", values.beneficiarySurname || "");
      formData.set("beneficiaryIdNumber", values.beneficiaryIdNumber || "");
      formData.set("beneficiaryAccountNumber", values.beneficiaryAccountNumber || "");
      formData.set("bankName", values.bankName || "");
      formData.set("accountType", values.accountType || "");
      formData.set("contactEmail", values.contactEmail || "");
      formData.set("dateOfDeath", values.dateOfDeath || "");
      // Honeypot – intentionally blank for real users.
      formData.set("companyWebsite", "");

      if (values.documents) {
        formData.set("documents", values.documents);
      }

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitState("error");
        setSubmitMessage(payload.error || "Submission failed. Please try again.");
        return;
      }

      setSubmitState("success");
      setSubmitMessage("Submitted successfully. Thank you.");
      reset(defaultValues);
    } catch {
      setSubmitState("error");
      setSubmitMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand to-brand2 shadow-soft" />
          <div>
            <div className="text-sm font-semibold tracking-wide text-white/90">KGA Life</div>
            <div className="text-xs text-white/60">Claim Assessment Form</div>
          </div>
        </div>
        <div className="hidden text-xs text-white/55 md:block">Secure submission • Max 10MB document</div>
      </header>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold tracking-tight text-white/95">Claim Assessment Form</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65">
            Complete the details below and upload supporting documents (Death Certificate, Notice of Death, Beneficiary ID, Deceased ID,
            Beneficiary bank statement). KGA Life will review and contact you if anything is missing.
          </p>
          <p className="mt-3 text-xs text-white/55">
            <span className="font-semibold text-rose-300">*</span> Indicates required fields
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-3">
              <div className="text-xs font-semibold tracking-wide text-white/70">MEMBER & POLICY</div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="MAIN MEMBER ID NUMBER">
                  <Input inputMode="numeric" placeholder="e.g. 8001015009087" {...register("mainMemberId")} />
                </Field>

                <Field label="POLICY NUMBER">
                  <Input placeholder="e.g. KGA-123456" {...register("policyNumber")} />
                </Field>

                <Field label="DECEASED ID NUMBER">
                  <Input inputMode="numeric" placeholder="e.g. 7801015009087" {...register("deceasedId")} />
                </Field>

                <Field label="CAUSE OF DEATH" required error={errors.causeOfDeath?.message}>
                  <Select defaultValue="" {...register("causeOfDeath")}>
                    <option value="" disabled>
                      Please select
                    </option>
                    {CAUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-xs font-semibold tracking-wide text-white/70">BENEFICIARY</div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Beneficiary FirstName" required error={errors.beneficiaryFirstName?.message}>
                  <Input placeholder="First name" {...register("beneficiaryFirstName")} />
                </Field>

                <Field label="Beneficiary Surname">
                  <Input placeholder="Surname" {...register("beneficiarySurname")} />
                </Field>

                <Field label="Beneficiary ID Number">
                  <Input inputMode="numeric" placeholder="e.g. 9001015009087" {...register("beneficiaryIdNumber")} />
                </Field>

                <Field label="Beneficiary Account Number">
                  <Input inputMode="numeric" placeholder="Account number" {...register("beneficiaryAccountNumber")} />
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-xs font-semibold tracking-wide text-white/70">BANKING</div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field className="md:col-span-2" label="Please Select Bank Name">
                  <Select defaultValue="" {...register("bankName")}>
                    <option value="">Please select</option>
                    {BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Please Select Account Type">
                  <Select defaultValue="" {...register("accountType")}>
                    <option value="">Please select</option>
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-xs font-semibold tracking-wide text-white/70">CONTACT & DOCUMENTS</div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Your Contact Email" error={errors.contactEmail?.message}>
                  <Input type="email" placeholder="you@example.com" {...register("contactEmail")} />
                </Field>

                <Field label="Date OF Death" hint="Select from the calendar (no typing needed).">
                  <DatePickerInput
                    registration={register("dateOfDeath")}
                    value={dateOfDeath || ""}
                    onClear={() => setValue("dateOfDeath", "")}
                  />
                </Field>
              </div>

              <Field
                label="Documents (Death Certificate, Notice of Death, Beneficiary ID, Deceased ID, Beneficiary bank statement)"
                error={errors.documents?.message as string | undefined}
                hint="Never submit passwords through this form."
              >
                <FileUpload
                  name="documents"
                  error={errors.documents?.message as string | undefined}
                  onFileSelected={(file) => setValue("documents", file, { shouldValidate: true })}
                />
              </Field>
            </section>

            <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center">
              <div className="text-sm text-white/70">
                {submitState === "success" ? (
                  <span className="text-emerald-300">{submitMessage}</span>
                ) : submitState === "error" ? (
                  <span className="text-rose-300">{submitMessage}</span>
                ) : (
                  <span className="text-white/55">We’ll send your submission to KGA Life for review.</span>
                )}
              </div>
              <Button type="submit" disabled={submitState === "submitting"}>
                {submitState === "submitting" ? (
                  <>
                    <Spinner /> Submitting…
                  </>
                ) : (
                  "Submit claim"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <footer className="mt-6 text-xs text-white/45">
        <div>© {new Date().getFullYear()} KGA Life. All rights reserved.</div>
      </footer>
    </div>
  );
}
