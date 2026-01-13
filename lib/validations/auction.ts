import { z } from "zod"

export const auctionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  platform: z.enum(["instagram", "tiktok", "youtube"], {
    required_error: "Please select a platform",
  }),
  content_type: z.string().min(3, "Content type is required"),
  delivery_window_start: z.string().min(1, "Start date is required"),
  delivery_window_end: z.string().min(1, "End date is required"),
  access_slots: z.number().min(1, "Must have at least 1 slot").max(100),
  entry_price: z.number().min(1, "Entry price must be at least $1"),
  reserve_price: z.number().min(1, "Reserve price must be at least $1"),
  prohibited_categories: z.array(z.string()).default([]),
}).refine(
  (data) => new Date(data.delivery_window_end) > new Date(data.delivery_window_start),
  {
    message: "End date must be after start date",
    path: ["delivery_window_end"],
  }
).refine(
  (data) => data.reserve_price >= data.entry_price,
  {
    message: "Reserve price must be at least equal to entry price",
    path: ["reserve_price"],
  }
)

export type AuctionFormData = z.infer<typeof auctionSchema>
