import { PropertyForm } from "@/components/dashboard/landlord/PropertyForm";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyForm propertyId={id} />;
}
