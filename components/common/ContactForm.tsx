"use client";
import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";

type State = "idle" | "sending" | "sent" | "error";

/** Posts to Web3Forms when NEXT_PUBLIC_WEB3FORMS_KEY is set; otherwise shows a mailto button only. */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");

  if (!siteConfig.web3formsKey) {
    return (
      <p>
        <a className="btn btn-primary no-underline" href={`mailto:${siteConfig.email}`} style={{ color: "#fff" }}>
          Email {siteConfig.email}
        </a>
      </p>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return;
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: siteConfig.web3formsKey,
          subject: `Message from ${siteConfig.name} contact form`,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (json.success) {
        setState("sent");
        form.reset();
      } else setState("error");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="not-prose space-y-4 rounded-2xl border border-surface-line bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="cf-name" className="block text-sm font-medium text-ink">Your name</label>
        <input id="cf-name" name="name" type="text" required maxLength={100} autoComplete="name" className="input mt-1" />
      </div>
      <div>
        <label htmlFor="cf-email" className="block text-sm font-medium text-ink">Your email</label>
        <input id="cf-email" name="email" type="email" required maxLength={200} autoComplete="email" className="input mt-1" />
      </div>
      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-ink">Message</label>
        <textarea id="cf-message" name="message" required minLength={10} maxLength={4000} rows={6} className="input mt-1" />
      </div>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <p className="text-sm text-ink-soft">Please do not include confidential documents or passwords. Your message is sent through the Web3Forms service to our inbox.</p>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
      <div role="status" aria-live="polite">
        {state === "sent" && <p className="font-medium text-emerald-700">Thank you. Your message was sent and we will reply by email.</p>}
        {state === "error" && (
          <p className="font-medium text-red-700">
            The message could not be sent. Please email <a className="underline" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> instead.
          </p>
        )}
      </div>
    </form>
  );
}
