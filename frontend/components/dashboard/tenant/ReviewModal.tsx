"use client";

import { ReviewForm } from "./ReviewForm";
import type { Property } from "@/lib/types";

interface ReviewModalProps {
  property: Property;
  rentalId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({
  property,
  rentalId,
  isOpen,
  onClose,
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <ReviewForm property={property} rentalId={rentalId} onClose={onClose} />
  );
}
