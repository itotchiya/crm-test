import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Clean up
  await prisma.notificationPreference.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.task.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.revenueMetric.deleteMany();
  await prisma.leadSource.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.companySettings.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@nexuscrm.com",
      name: "John Doe",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      avatar: "JD",
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: "sarah@nexuscrm.com",
      name: "Sarah Williams",
      password: await bcrypt.hash("sales123", 10),
      role: "SALES_REP",
      avatar: "SW",
    },
  });

  // Create contacts
  const contacts = await prisma.contact.createMany({
    data: [
      { name: "Sarah Johnson", company: "Acme Corporation", email: "sarah@acme.com", phone: "+1 (555) 123-4567", status: "Active", revenue: 142500, lastContact: new Date("2024-12-15"), avatar: "SJ", assignedTo: adminUser.id },
      { name: "Michael Chen", company: "TechStart Inc", email: "michael@techstart.io", phone: "+1 (555) 234-5678", status: "Active", revenue: 98200, lastContact: new Date("2024-12-14"), avatar: "MC", assignedTo: adminUser.id },
      { name: "Emma Davis", company: "Global Retail Ltd", email: "emma@globalretail.com", phone: "+1 (555) 345-6789", status: "Active", revenue: 215000, lastContact: new Date("2024-12-12"), avatar: "ED", assignedTo: salesUser.id },
      { name: "James Wilson", company: "DataFlow Systems", email: "james@dataflow.net", phone: "+1 (555) 456-7890", status: "Inactive", revenue: 45800, lastContact: new Date("2024-11-28"), avatar: "JW", assignedTo: adminUser.id },
      { name: "Lisa Anderson", company: "Bright Solutions", email: "lisa@bright.io", phone: "+1 (555) 567-8901", status: "Active", revenue: 167300, lastContact: new Date("2024-12-08"), avatar: "LA", assignedTo: salesUser.id },
      { name: "Robert Taylor", company: "Nexus Partners", email: "robert@nexus.com", phone: "+1 (555) 678-9012", status: "Prospect", revenue: 0, lastContact: new Date("2024-12-05"), avatar: "RT", assignedTo: adminUser.id },
      { name: "Jennifer Martinez", company: "Cloud Nine Co", email: "jen@cloudnine.co", phone: "+1 (555) 789-0123", status: "Active", revenue: 89400, lastContact: new Date("2024-12-13"), avatar: "JM", assignedTo: salesUser.id },
      { name: "David Brown", company: "Stark Industries", email: "david@stark.com", phone: "+1 (555) 890-1234", status: "Inactive", revenue: 234000, lastContact: new Date("2024-10-22"), avatar: "DB", assignedTo: adminUser.id },
      { name: "Bruce Wayne", company: "Wayne Enterprises", email: "bruce@wayne.com", phone: "+1 (555) 901-2345", status: "Active", revenue: 175000, lastContact: new Date("2024-12-10"), avatar: "BW", assignedTo: salesUser.id },
      { name: "Norman Osborn", company: "Oscorp Industries", email: "norman@oscorp.com", phone: "+1 (555) 012-3456", status: "Inactive", revenue: 0, lastContact: new Date("2024-11-15"), avatar: "NO", assignedTo: adminUser.id },
      { name: "Clark Kent", company: "Daily Planet", email: "clark@dailyplanet.com", phone: "+1 (555) 111-2222", status: "Active", revenue: 28000, lastContact: new Date("2024-12-01"), avatar: "CK", assignedTo: salesUser.id },
      { name: "Lex Luthor", company: "LexCorp", email: "lex@lexcorp.com", phone: "+1 (555) 222-3333", status: "Prospect", revenue: 0, lastContact: new Date("2024-12-03"), avatar: "LL", assignedTo: adminUser.id },
      { name: "Alice Abernathy", company: "Umbrella Corporation", email: "alice@umbrella.com", phone: "+1 (555) 333-4444", status: "Prospect", revenue: 0, lastContact: new Date("2024-11-20"), avatar: "AA", assignedTo: salesUser.id },
      { name: "Nina Sharp", company: "Massive Dynamic", email: "nina@massivedynamic.com", phone: "+1 (555) 444-5555", status: "Prospect", revenue: 0, lastContact: new Date("2024-11-10"), avatar: "NS", assignedTo: adminUser.id },
    ],
  });

  const allContacts = await prisma.contact.findMany();

  // Create deals
  await prisma.deal.createMany({
    data: [
      { title: "Acme Corp - Enterprise License", contactId: allContacts.find(c => c.company === "Acme Corporation")!.id, value: 48500, probability: 75, stage: "Negotiation", daysInStage: 12, avatar: "AC", color: "indigo", assignedTo: adminUser.id },
      { title: "Nexus Partners - Annual Contract", contactId: allContacts.find(c => c.company === "Nexus Partners")!.id, value: 120000, probability: 80, stage: "Negotiation", daysInStage: 8, avatar: "NP", color: "purple", assignedTo: adminUser.id },
      { title: "TechStart - Starter Package", contactId: allContacts.find(c => c.company === "TechStart Inc")!.id, value: 32000, probability: 60, stage: "Proposal", daysInStage: 5, avatar: "TI", color: "cyan", assignedTo: salesUser.id },
      { title: "Bright Solutions - Growth Plan", contactId: allContacts.find(c => c.company === "Bright Solutions")!.id, value: 56000, probability: 55, stage: "Proposal", daysInStage: 3, avatar: "BS", color: "amber", assignedTo: salesUser.id },
      { title: "DataFlow - Basic Integration", contactId: allContacts.find(c => c.company === "DataFlow Systems")!.id, value: 22400, probability: 40, stage: "Qualified", daysInStage: 18, avatar: "DS", color: "slate", assignedTo: adminUser.id },
      { title: "Cloud Nine - Premium Suite", contactId: allContacts.find(c => c.company === "Cloud Nine Co")!.id, value: 67000, probability: 35, stage: "Qualified", daysInStage: 7, avatar: "CN", color: "pink", assignedTo: salesUser.id },
      { title: "Global Retail - Platform Deal", contactId: allContacts.find(c => c.company === "Global Retail Ltd")!.id, value: 85000, probability: 100, stage: "Closed_Won", daysInStage: 0, avatar: "GR", color: "emerald", assignedTo: salesUser.id },
      { title: "Stark Industries - Custom Build", contactId: allContacts.find(c => c.company === "Stark Industries")!.id, value: 234000, probability: 100, stage: "Closed_Won", daysInStage: 0, avatar: "ST", color: "red", assignedTo: adminUser.id },
      { title: "Wayne Enterprises - Analytics", contactId: allContacts.find(c => c.company === "Wayne Enterprises")!.id, value: 175000, probability: 100, stage: "Closed_Won", daysInStage: 0, avatar: "WE", color: "blue", assignedTo: salesUser.id },
      { title: "Oscorp - R&D Partnership", contactId: allContacts.find(c => c.company === "Oscorp Industries")!.id, value: 92000, probability: 0, stage: "Closed_Lost", daysInStage: 0, avatar: "OI", color: "green", assignedTo: adminUser.id },
      { title: "Daily Planet - Media License", contactId: allContacts.find(c => c.company === "Daily Planet")!.id, value: 28000, probability: 0, stage: "Closed_Lost", daysInStage: 0, avatar: "DP", color: "orange", assignedTo: salesUser.id },
      { title: "LexCorp - Consulting", contactId: allContacts.find(c => c.company === "LexCorp")!.id, value: 45000, probability: 25, stage: "Lead", daysInStage: 22, avatar: "LC", color: "violet", assignedTo: adminUser.id },
      { title: "Umbrella Corp - Security", contactId: allContacts.find(c => c.company === "Umbrella Corporation")!.id, value: 78000, probability: 15, stage: "Lead", daysInStage: 14, avatar: "UC", color: "rose", assignedTo: salesUser.id },
      { title: "Massive Dynamic - Research", contactId: allContacts.find(c => c.company === "Massive Dynamic")!.id, value: 310000, probability: 20, stage: "Lead", daysInStage: 30, avatar: "MD", color: "teal", assignedTo: adminUser.id },
    ],
  });

  // Create activities
  await prisma.activity.createMany({
    data: [
      { type: "deal", title: "Deal won with Acme Corporation", description: "Value: $48,500 • Closed by Sarah Johnson", icon: "CheckCircle", userId: adminUser.id },
      { type: "call", title: "Call with TechStart Inc", description: "Discussed proposal details with Michael Chen", icon: "Phone", userId: salesUser.id },
      { type: "email", title: "Email sent to Global Retail", description: "Follow-up on contract terms", icon: "Mail", userId: salesUser.id },
      { type: "meeting", title: "Meeting with DataFlow Systems", description: "Product demo scheduled for next week", icon: "Calendar", userId: adminUser.id },
      { type: "note", title: "Note added for Bright Solutions", description: "Customer interested in premium plan", icon: "FileText", userId: salesUser.id },
      { type: "deal", title: "New deal created: Nexus Partners", description: "Potential value: $120,000", icon: "PlusCircle", userId: adminUser.id },
    ],
  });

  // Create tasks
  await prisma.task.createMany({
    data: [
      { title: "Follow up with Acme Corp", priority: "High", due: new Date("2024-12-20"), completed: false, assignedTo: adminUser.id },
      { title: "Prepare proposal for TechStart", priority: "High", due: new Date("2024-12-21"), completed: false, assignedTo: salesUser.id },
      { title: "Review Q4 sales metrics", priority: "Medium", due: new Date("2024-12-22"), completed: false, assignedTo: adminUser.id },
      { title: "Update customer database", priority: "Low", due: new Date("2024-12-23"), completed: true, assignedTo: salesUser.id },
      { title: "Schedule team meeting", priority: "Medium", due: new Date("2024-12-24"), completed: false, assignedTo: adminUser.id },
    ],
  });

  // Create calendar events
  await prisma.calendarEvent.createMany({
    data: [
      { title: "Demo with Acme Corp", date: new Date("2024-12-20"), time: "10:00 AM", duration: "1h", type: "demo", with: "Sarah Johnson", company: "Acme Corporation", userId: adminUser.id },
      { title: "Follow-up Call - TechStart", date: new Date("2024-12-20"), time: "2:00 PM", duration: "30m", type: "call", with: "Michael Chen", company: "TechStart Inc", userId: salesUser.id },
      { title: "Contract Review", date: new Date("2024-12-21"), time: "11:00 AM", duration: "45m", type: "meeting", with: "Legal Team", company: "Internal", userId: adminUser.id },
      { title: "Quarterly Review", date: new Date("2024-12-23"), time: "9:00 AM", duration: "2h", type: "meeting", with: "Sales Team", company: "Internal", userId: adminUser.id },
      { title: "Proposal Presentation", date: new Date("2024-12-23"), time: "3:00 PM", duration: "1h", type: "demo", with: "Emma Davis", company: "Global Retail Ltd", userId: salesUser.id },
      { title: "Discovery Call - New Lead", date: new Date("2024-12-24"), time: "10:30 AM", duration: "45m", type: "call", with: "Potential Client", company: "TBD", userId: adminUser.id },
      { title: "Year-End Planning", date: new Date("2024-12-27"), time: "1:00 PM", duration: "1.5h", type: "meeting", with: "Management", company: "Internal", userId: adminUser.id },
      { title: "Negotiation - Nexus Partners", date: new Date("2024-12-30"), time: "11:00 AM", duration: "2h", type: "meeting", with: "Robert Taylor", company: "Nexus Partners", userId: salesUser.id },
    ],
  });

  // Create campaigns
  await prisma.campaign.createMany({
    data: [
      { name: "Q4 Product Launch", status: "Active", type: "Email", sent: 15420, opened: 8934, clicked: 3421, converted: 512, revenue: 128400, startDate: new Date("2024-11-01"), endDate: new Date("2024-12-31") },
      { name: "Holiday Special", status: "Active", type: "Multi-channel", sent: 28100, opened: 15234, clicked: 5890, converted: 876, revenue: 234600, startDate: new Date("2024-12-01"), endDate: new Date("2025-01-05") },
      { name: "Enterprise Webinar", status: "Completed", type: "Webinar", sent: 8900, opened: 6230, clicked: 2100, converted: 342, revenue: 85200, startDate: new Date("2024-10-15"), endDate: new Date("2024-11-15") },
      { name: "Referral Program", status: "Active", type: "Social", sent: 5600, opened: 3450, clicked: 1890, converted: 267, revenue: 67800, startDate: new Date("2024-12-10"), endDate: new Date("2025-02-28") },
      { name: "Win-Back Campaign", status: "Draft", type: "Email", sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0, startDate: new Date("2025-01-15"), endDate: new Date("2025-02-15") },
    ],
  });

  // Create revenue metrics
  await prisma.revenueMetric.createMany({
    data: [
      { month: "Jan", year: 2024, revenue: 42000, target: 45000, deals: 12, customers: 8 },
      { month: "Feb", year: 2024, revenue: 48000, target: 47000, deals: 15, customers: 10 },
      { month: "Mar", year: 2024, revenue: 52000, target: 50000, deals: 18, customers: 12 },
      { month: "Apr", year: 2024, revenue: 49000, target: 52000, deals: 14, customers: 9 },
      { month: "May", year: 2024, revenue: 61000, target: 55000, deals: 22, customers: 15 },
      { month: "Jun", year: 2024, revenue: 58000, target: 60000, deals: 20, customers: 14 },
      { month: "Jul", year: 2024, revenue: 72000, target: 65000, deals: 28, customers: 18 },
      { month: "Aug", year: 2024, revenue: 68000, target: 70000, deals: 25, customers: 16 },
      { month: "Sep", year: 2024, revenue: 79000, target: 75000, deals: 32, customers: 20 },
      { month: "Oct", year: 2024, revenue: 85000, target: 80000, deals: 35, customers: 22 },
      { month: "Nov", year: 2024, revenue: 92000, target: 88000, deals: 38, customers: 24 },
      { month: "Dec", year: 2024, revenue: 105000, target: 95000, deals: 42, customers: 28 },
    ],
  });

  // Create team members
  await prisma.teamMember.createMany({
    data: [
      { name: "John Doe", role: "Sales Manager", deals: 42, revenue: 284500, conversion: 28, target: 100, avatar: "JD", userId: adminUser.id },
      { name: "Jane Smith", role: "Account Executive", deals: 36, revenue: 198400, conversion: 24, target: 85, avatar: "JS" },
      { name: "Mike Johnson", role: "Sales Rep", deals: 28, revenue: 156200, conversion: 21, target: 70, avatar: "MJ" },
      { name: "Sarah Williams", role: "Account Executive", deals: 31, revenue: 174800, conversion: 22, target: 75, avatar: "SW", userId: salesUser.id },
      { name: "David Lee", role: "Sales Rep", deals: 22, revenue: 124600, conversion: 18, target: 60, avatar: "DL" },
    ],
  });

  // Create lead sources
  await prisma.leadSource.createMany({
    data: [
      { name: "Website", value: 342, color: "#4f46e5" },
      { name: "Referral", value: 218, color: "#06b6d4" },
      { name: "Social Media", value: 156, color: "#8b5cf6" },
      { name: "Email Campaign", value: 128, color: "#f59e0b" },
      { name: "Event", value: 94, color: "#ec4899" },
      { name: "Other", value: 62, color: "#64748b" },
    ],
  });

  // Create integrations
  await prisma.integration.createMany({
    data: [
      { name: "Slack", description: "Get deal notifications in Slack", connected: true, icon: "SL" },
      { name: "Zapier", description: "Automate workflows with Zapier", connected: true, icon: "ZP" },
      { name: "Google Calendar", description: "Sync meetings and events", connected: true, icon: "GC" },
      { name: "Mailchimp", description: "Email marketing integration", connected: false, icon: "MC" },
      { name: "HubSpot", description: "Two-way contact sync", connected: false, icon: "HS" },
      { name: "Stripe", description: "Payment and invoicing", connected: false, icon: "ST" },
    ],
  });

  // Create company settings
  await prisma.companySettings.create({
    data: {
      name: "Nexus Solutions Inc",
      website: "https://nexuscrm.io",
      industry: "Software / SaaS",
      size: "50-200 employees",
      address: "123 Innovation Drive, San Francisco, CA 94105",
    },
  });

  // Create notification preferences for admin
  await prisma.notificationPreference.createMany({
    data: [
      { label: "Deal Won", description: "Notify when a deal is marked as won", enabled: true, category: "deals", userId: adminUser.id },
      { label: "Deal Lost", description: "Notify when a deal is marked as lost", enabled: true, category: "deals", userId: adminUser.id },
      { label: "New Lead Assigned", description: "Notify when a new lead is assigned to you", enabled: true, category: "leads", userId: adminUser.id },
      { label: "Task Due", description: "Notify when a task is due soon", enabled: false, category: "tasks", userId: adminUser.id },
      { label: "Meeting Reminders", description: "Remind 15 minutes before meetings", enabled: true, category: "calendar", userId: adminUser.id },
      { label: "Weekly Report", description: "Receive weekly performance summary", enabled: true, category: "reports", userId: adminUser.id },
      { label: "Mentions", description: "Notify when someone mentions you", enabled: true, category: "social", userId: adminUser.id },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
