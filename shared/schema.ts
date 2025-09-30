import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

// User table schema
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
});

// User types
export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service type"),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
