"use client";

import { useSession } from "next-auth/react";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { StickerPicker } from "./sticker-picker";
import { Form, Field, FieldError } from "@/shared/components/ui/form";

const FormSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Bình luận phải dài ít nhất 1 ký tự!" })
    .max(2000, { message: "Bình luận không được dài hơn 2000 ký tự!" }),
});

type FormData = z.infer<typeof FormSchema>;

interface CommentFormSimpleProps {
  id: string;
  type: "manga" | "chapter";
  title: string;
  chapterNumber?: string;
  onCommentPosted?: () => void;
}

export default function CommentFormSimple({
  id,
  type,
  title,
  chapterNumber,
  onCommentPosted,
}: CommentFormSimpleProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = form;

  if (!session?.user?.id) {
    return (
      <Alert className="justify-center rounded-sm text-center">
        <AlertTitle>Bạn cần đăng nhập để bình luận!</AlertTitle>
      </Alert>
    );
  }

  async function onSubmit(data: FormData) {
    try {
      setLoading(true);
      const endpoint = `/api/comments/${type}/${id}`;

      const body: {
        content: string;
        title: string;
        chapterNumber?: string;
      } = {
        content: data.comment,
        title: title,
      };

      if (chapterNumber) {
        body.chapterNumber = chapterNumber;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rap chậm thôi bruh...😓", { closeButton: false });
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        }
        return;
      }

      reset();
      onCommentPosted?.();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  }

  const insertSticker = (stickerName: string) => {
    const currentValue = getValues("comment");
    const newValue = currentValue
      ? `${currentValue} :${stickerName}:`
      : `:${stickerName}:`;
    setValue("comment", newValue);
  };

  return (
    <Form {...form}>
      <form onSubmit={void handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* Bọc trong component Field mới */}
        <Field>
          <div className="relative">
            <Controller
              control={control}
              name="comment"
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Viết bình luận...(hỗ trợ markdown)"
                  className="bg-sidebar min-h-[100px] resize-none rounded-sm pr-10" // pr-10 để tránh sticker che text
                  maxLength={2000}
                  disabled={loading}
                />
              )}
            />

            {/* Sticker Picker - Position absolute góc phải dưới */}
            <div className="absolute right-2 bottom-2 z-10">
              <StickerPicker onSelectSticker={insertSticker} />
            </div>
          </div>

          {/* Hiển thị lỗi - Truyền mảng errors vào (vì FieldError của bạn nhận mảng) */}
          <FieldError errors={[errors.comment]} />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Gửi bình luận
          </Button>
        </div>
      </form>
    </Form>
  );
}
