"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  LIMITS,
  validateEndorsement,
  type FieldErrors,
} from "@/lib/endorsements/rules";
import { CardCorners, SANS, SERIF } from "./parts";

const FIELD_ORDER = ["rating", "quote", "name", "role"] as const;
const NETWORK_ERROR = "Your endorsement couldn't be sent. Please try again.";
const RATINGS = [1, 2, 3, 4, 5];

function FieldError({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="pf-end-error">
      {text}
    </p>
  );
}

/** The "Leave an endorsement" button and the form it opens. */
export default function EndorsementDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [quoteLength, setQuoteLength] = useState(0);

  const shownRating = hovered || rating;

  function showErrors(form: HTMLFormElement, next: FieldErrors) {
    setErrors(next);
    const first = FIELD_ORDER.find((field) => next[field]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setFormError("");

    const check = validateEndorsement(data);
    if (!check.ok) {
      showErrors(form, check.errors);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/endorsements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...check.value, website: data.website }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus("sent");
        return;
      }
      setStatus("idle");
      if (result.errors) showErrors(form, result.errors);
      else setFormError(result.error ?? NETWORK_ERROR);
    } catch {
      setStatus("idle");
      setFormError(NETWORK_ERROR);
    }
  }

  function afterClose() {
    if (status !== "sent") return;
    setStatus("idle");
    setRating(0);
    setHovered(0);
    setQuoteLength(0);
  }

  const invalid = (field: keyof FieldErrors) =>
    errors[field]
      ? {
          "aria-invalid": true as const,
          "aria-describedby": `end-${field}-error`,
        }
      : {};

  return (
    <>
      <button
        type="button"
        className="pf-end-cta"
        onClick={() => dialog.current?.showModal()}
      >
        Leave an endorsement
      </button>
      <dialog
        ref={dialog}
        className="pf-end-dialog"
        aria-labelledby="end-title"
        onClose={afterClose}
        style={{ fontFamily: SANS }}
      >
        <div className="pf-end-card">
          <CardCorners />
          <button
            type="button"
            className="pf-end-close"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
          >
            ✕
          </button>
          {status === "sent" ? (
            <div role="status">
              <h2
                id="end-title"
                className="pf-end-title"
                style={{ fontFamily: SERIF }}
              >
                Thank you ♥︎
              </h2>
              <p className="pf-end-intro">
                Your endorsement has been sent. It will appear on a card once
                Luka has approved it.
              </p>
              <button
                type="button"
                className="pf-end-submit"
                onClick={() => dialog.current?.close()}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2
                id="end-title"
                className="pf-end-title"
                style={{ fontFamily: SERIF }}
              >
                Leave an endorsement
              </h2>
              <p className="pf-end-intro">
                Your words, name and role will appear on a card here once Luka
                has approved them.
              </p>

              <fieldset
                className="pf-end-field"
                aria-describedby={
                  errors.rating ? "end-rating-error" : undefined
                }
              >
                <legend className="pf-end-label">Your rating</legend>
                <div
                  className="pf-end-stars"
                  onMouseLeave={() => setHovered(0)}
                >
                  {RATINGS.map((value) => (
                    <label key={value} onMouseEnter={() => setHovered(value)}>
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={rating === value}
                        onChange={() => setRating(value)}
                        aria-label={`${value} out of 5 stars`}
                      />
                      <span aria-hidden="true">
                        {value <= shownRating ? "★" : "☆"}
                      </span>
                    </label>
                  ))}
                </div>
                <FieldError id="end-rating-error" text={errors.rating} />
              </fieldset>

              <div className="pf-end-field">
                <label className="pf-end-label" htmlFor="end-quote">
                  Your endorsement
                </label>
                <textarea
                  id="end-quote"
                  name="quote"
                  rows={4}
                  maxLength={LIMITS.quote.max}
                  onChange={(e) => setQuoteLength(e.target.value.length)}
                  {...invalid("quote")}
                />
                <p className="pf-end-count">
                  {quoteLength} / {LIMITS.quote.max}
                </p>
                <FieldError id="end-quote-error" text={errors.quote} />
              </div>

              <div className="pf-end-field">
                <label className="pf-end-label" htmlFor="end-name">
                  Your name
                </label>
                <input
                  id="end-name"
                  name="name"
                  autoComplete="name"
                  maxLength={LIMITS.name.max}
                  {...invalid("name")}
                />
                <FieldError id="end-name-error" text={errors.name} />
              </div>

              <div className="pf-end-field">
                <label className="pf-end-label" htmlFor="end-role">
                  Your role
                </label>
                <input
                  id="end-role"
                  name="role"
                  placeholder="Team lead at Acme"
                  autoComplete="organization-title"
                  maxLength={LIMITS.role.max}
                  {...invalid("role")}
                />
                <FieldError id="end-role-error" text={errors.role} />
              </div>

              {/* Hidden from people; bots that fill every field reveal themselves. */}
              <div className="pf-end-trap" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {formError && (
                <p className="pf-end-error" role="alert">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                className="pf-end-submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send endorsement"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
