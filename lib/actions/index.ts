"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Contacts
export async function createContact(data: {
  name: string;
  email: string;
  phone?: string;
  company: string;
  status: string;
  assignedTo?: string;
}) {
  const contact = await prisma.contact.create({
    data: {
      ...data,
      status: data.status as any,
      avatar: data.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
      lastContact: new Date(),
    },
  });
  revalidatePath("/customers");
  revalidatePath("/dashboard");
  return contact;
}

export async function updateContact(id: string, data: Partial<{
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  revenue: number;
}>) {
  const contact = await prisma.contact.update({
    where: { id },
    data: {
      ...data,
      status: data.status as any,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/customers");
  revalidatePath("/dashboard");
  return contact;
}

export async function deleteContact(id: string) {
  await prisma.contact.delete({ where: { id } });
  revalidatePath("/customers");
  revalidatePath("/dashboard");
}

// Deals
export async function createDeal(data: {
  title: string;
  value: number;
  probability: number;
  stage: string;
  contactId: string;
  assignedTo?: string;
}) {
  const deal = await prisma.deal.create({
    data: {
      ...data,
      stage: data.stage as any,
      daysInStage: 0,
      color: ["indigo", "purple", "cyan", "amber", "slate", "pink", "emerald", "red", "blue", "orange", "violet", "rose", "teal", "green"][Math.floor(Math.random() * 14)],
    },
  });
  revalidatePath("/deals");
  revalidatePath("/dashboard");
  return deal;
}

export async function updateDeal(id: string, data: Partial<{
  title: string;
  value: number;
  probability: number;
  stage: string;
  daysInStage: number;
}>) {
  const deal = await prisma.deal.update({
    where: { id },
    data: {
      ...data,
      stage: data.stage as any,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/deals");
  revalidatePath("/dashboard");
  return deal;
}

export async function deleteDeal(id: string) {
  await prisma.deal.delete({ where: { id } });
  revalidatePath("/deals");
  revalidatePath("/dashboard");
}

export async function moveDealStage(id: string, stage: string) {
  const deal = await prisma.deal.update({
    where: { id },
    data: {
      stage: stage as any,
      daysInStage: 0,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/deals");
  revalidatePath("/dashboard");
  return deal;
}

// Tasks
export async function createTask(data: {
  title: string;
  priority: string;
  due?: Date;
  assignedTo?: string;
}) {
  const task = await prisma.task.create({
    data: {
      ...data,
      priority: data.priority as any,
    },
  });
  revalidatePath("/dashboard");
  return task;
}

export async function toggleTask(id: string, completed: boolean) {
  const task = await prisma.task.update({
    where: { id },
    data: { completed },
  });
  revalidatePath("/dashboard");
  return task;
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/dashboard");
}

// Events
export async function createEvent(data: {
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: string;
  with?: string;
  company?: string;
  userId?: string;
}) {
  const event = await prisma.calendarEvent.create({
    data: {
      ...data,
      type: data.type as any,
    },
  });
  revalidatePath("/calendar");
  return event;
}

export async function updateEvent(id: string, data: Partial<{
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: string;
  with: string;
  company: string;
}>) {
  const event = await prisma.calendarEvent.update({
    where: { id },
    data: {
      ...data,
      type: data.type as any,
    },
  });
  revalidatePath("/calendar");
  return event;
}

export async function deleteEvent(id: string) {
  await prisma.calendarEvent.delete({ where: { id } });
  revalidatePath("/calendar");
}

// Campaigns
export async function createCampaign(data: {
  name: string;
  type: string;
  status: string;
  sent?: number;
  opened?: number;
  clicked?: number;
  converted?: number;
  revenue?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const campaign = await prisma.campaign.create({
    data: {
      ...data,
      status: data.status as any,
    },
  });
  revalidatePath("/campaigns");
  return campaign;
}

export async function updateCampaign(id: string, data: Partial<{
  name: string;
  type: string;
  status: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
}>) {
  const campaign = await prisma.campaign.update({
    where: { id },
    data: {
      ...data,
      status: data.status as any,
    },
  });
  revalidatePath("/campaigns");
  return campaign;
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/campaigns");
}

// User settings
export async function updateUser(id: string, data: {
  name?: string;
  email?: string;
  avatar?: string;
}) {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  revalidatePath("/settings");
  return user;
}

export async function updateCompanySettings(data: {
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
  address?: string;
}) {
  const settings = await prisma.companySettings.updateMany({
    data,
  });
  revalidatePath("/settings");
  return settings;
}

export async function updateNotificationPreference(userId: string, label: string, enabled: boolean) {
  const pref = await prisma.notificationPreference.updateMany({
    where: { userId, label },
    data: { enabled },
  });
  revalidatePath("/settings");
  return pref;
}
