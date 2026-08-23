import { prisma } from "../../lib/prisma";

const getLandlordProperties = async (landlordId: string) => {
  return prisma.property.findMany({
    where: { landlordId },
    include: { category: true, landlord: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const createProperty = async (landlordId: string, payload: any) => {
  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId
    }
  });
  return property;
};


const updateProperty = async (
  id: string,
  landlordId: string,
  payload: any
) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });


  if (!property || property.landlordId !== landlordId) {
    throw new Error("Property not found or unauthorized");
  }

  return prisma.property.update({
    where: { id },
    data: payload,
  });
};

const deleteProperty = async (id: string, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property || property.landlordId !== landlordId) {
    throw new Error("Property not found or unauthorized");
  }

  await prisma.property.delete({ where: { id } });
  return null;
};

const getAllProperties = async (filters: any) => {
  const { searchTerm, city, minPrice, maxPrice, categoryId } = filters;
  
  const whereConditions: any = {};

  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm as string, mode: 'insensitive' } },
      { description: { contains: searchTerm as string, mode: 'insensitive' } },
      { address: { contains: searchTerm as string, mode: 'insensitive' } },
    ];
  }

  if (city) {
    whereConditions.city = city;
  }

  if (categoryId) {
    whereConditions.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    whereConditions.rent = {};
    if (minPrice) whereConditions.rent.gte = parseFloat(minPrice);
    if (maxPrice) whereConditions.rent.lte = parseFloat(maxPrice);
  }

  const properties = await prisma.property.findMany({
    where: whereConditions,
    include: {
      category: true,
      landlord: {
        select: {
          name: true,
          email: true,
          phone: true,
        }
      }
    }
  });

  return properties;
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: {
          name: true,
          email: true,
          phone: true,
          image: true
        }
      },
      reviews: true
    }
  });
  return property;
};

export const propertyService = {
  getLandlordProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById
};
