"use client";

import { PaperPlaneIcon, ReloadIcon } from "@radix-ui/react-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import Link from "next/link";
import { useState } from "react";

type Inputs = {
  name: string;
  email: string;
  message: string;
};

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const processForm: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processForm)}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {/* Name */}
        <div className="h-16">
          <Input
            id="name"
            type="text"
            placeholder="Name"
            autoComplete="given-name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name?.message && (
            <p className="input-error">{String(errors.name.message)}</p>
          )}
        </div>

        {/* Email */}
        <div className="h-16">
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email?.message && (
            <p className="input-error">{String(errors.email.message)}</p>
          )}
        </div>

        {/* Message */}
        <div className="h-32 sm:col-span-2">
          <Textarea
            rows={4}
            placeholder="Leave feedback about the site, career opportunities or just to say hello etc."
            autoComplete="Message"
            className="resize-none"
            {...register("message", { required: "Message is required" })}
          />
          {errors.message?.message && (
            <p className="input-error">{String(errors.message.message)}</p>
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