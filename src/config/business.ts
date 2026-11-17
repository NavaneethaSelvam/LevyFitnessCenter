const readSetting = (value: string | undefined) => value?.trim() ?? "";

export const business = {
  phone: readSetting(process.env.NEXT_PUBLIC_BUSINESS_PHONE) || "8122339694",
  whatsapp: readSetting(process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP) || "+918122339694",
  email: readSetting(process.env.NEXT_PUBLIC_BUSINESS_EMAIL),
  address:
    readSetting(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS) ||
    "Eastcross, Old Bus Stand, Namakkal - 637001",
  instagram: readSetting(process.env.NEXT_PUBLIC_BUSINESS_INSTAGRAM),
};

export const phoneHref = business.phone
  ? `tel:${business.phone.replace(/[^\d+]/g, "")}`
  : "";

export const whatsappHref = business.whatsapp
  ? `https://wa.me/${business.whatsapp.replace(/\D/g, "")}`
  : "";

export const instagramHref = business.instagram
  ? `https://www.instagram.com/${business.instagram.replace(/^@/, "")}/`
  : "";
