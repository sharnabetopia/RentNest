import { notFound } from "next/navigation";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { getProperty } from "@/lib/api/properties";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getProperty(id).catch(() => null);
  if (!response?.data) notFound();
  return <PropertyDetails property={response.data} />;
}
