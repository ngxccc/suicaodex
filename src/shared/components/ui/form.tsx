"use client";

import { FormProvider } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/ui/label";
import { forwardRef } from "react";

const Form = FormProvider;

const Field = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("group/field space-y-2", className)}
        {...props}
      />
    );
  },
);
Field.displayName = "Field";

const FieldLabel = forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(
        "group-data-[invalid=true]/field:text-destructive",
        className,
      )}
      {...props}
    />
  );
});
FieldLabel.displayName = "FieldLabel";

const FieldDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-muted-foreground text-[0.8rem]", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

const FieldError = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { errors?: any[] }
>(({ className, errors, ...props }, ref) => {
  const error = errors?.find((e) => e);

  if (!error) return null;

  return (
    <p
      ref={ref}
      className={cn("text-destructive text-[0.8rem] font-medium", className)}
      {...props}
    >
      {error.message}
    </p>
  );
});
FieldError.displayName = "FieldError";

const FieldSet = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
FieldSet.displayName = "FieldSet";

const FieldLegend = forwardRef<
  React.ComponentRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  );
});
FieldLegend.displayName = "FieldLegend";

const FieldGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
FieldGroup.displayName = "FieldGroup";

export {
  Form,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldGroup,
};
