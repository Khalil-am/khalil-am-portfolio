"use client";

import { PaperPlaneIcon, ReloadIcon } from "@radix-ui/react-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Inputs = {
  name: string;
  email: string;
  message: string;
  website: string;
};

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const processForm: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("The message could not be sent.");
      }

      reset();
      toast.success("Message sent. Khalil will get back to you soon.");
    } catch {
      toast.error(
        "The message could not be sent. Please email khalil-am@outlook.com instead.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            autoComplete="given-name"
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name", {
              required: "Name is required",
              maxLength: { value: 100, message: "Name is too long" },
            })}
          />
          {errors.name?.message && (
            <p id="name-error" className="input-error">
              {String(errors.name.message)}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email", {
              required: "Email is required",
              maxLength: { value: 254, message: "Email is too long" },
            })}
          />
          {errors.email?.message && (
            <p id="email-error" className="input-error">
              {String(errors.email.message)}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-2 block text-sm font-semibold">
            Message
          </label>
          <Textarea
            id="message"
            rows={4}
            placeholder="Tell Khalil about the opportunity, collaboration, or question."
            autoComplete="off"
            className="resize-none"
            maxLength={5000}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message", {
              required: "Message is required",
              maxLength: { value: 5000, message: "Message is too long" },
            })}
          />
          {errors.message?.message && (
            <p id="message-error" className="input-error">
              {String(errors.message.message)}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <span>Sending...</span>
              <ReloadIcon className="ml-2 animate-spin" />
            </div>
          ) : (
            <div className="flex items-center">
              <span>Send Message</span>
              <PaperPlaneIcon className="ml-2" />
            </div>
          )}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          By submitting this form, I agree to the{" "}
          <Link href="/privacy" className="link font-semibold">
            privacy&nbsp;policy.
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
