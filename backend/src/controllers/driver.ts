import { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

export const searchDrivers = async (req: Request, resp: Response) => {
  // Extract query parameters for name and phone
  const { name, phone } = req.query;
  try {
    // Build filter object based on query parameters
    const filter: any = {};
    if (name) {
      filter.name = { contains: String(name), mode: "insensitive" }; // Case-insensitive search for name
    }
    if (phone) {
      filter.phone = { contains: String(phone), mode: "insensitive" }; // Case-insensitive search for phone
    }
    console.log(filter);
    // Fetch drivers based on the filter
    const drivers = await prisma.driver.findMany({
      where: filter,
    });

    if (drivers.length === 0) {
      return resp
        .status(404)
        .json({ message: "No drivers found matching the criteria" });
    }

    return resp.status(200).json(drivers); // Return the search results
  } catch (error: unknown) {
    console.error("Error searching drivers:", error);
    return resp.status(500).json({ message: "Something went wrong" }); // Handle any unexpected errors
  }
};

export const getDriverById = async (req: Request, resp: Response) => {
  const { id } = req.params; // Assuming the driver ID is passed as a URL parameter

  try {
    // Fetch the driver with the given ID
    const driver = await prisma.driver.findUnique({
      where: {
        id: Number(id), // Convert ID to number if it's a numeric ID
      },
    });

    if (!driver) {
      return resp.status(404).json({ message: "Driver not found" });
    }

    return resp.status(200).json(driver); // Return the driver in the response
  } catch (error: unknown) {
    console.error("Error fetching driver:", error);
    return resp.status(500).json({ message: "Something went wrong" }); // Handle any unexpected errors
  }
};

export const createDriver = async (req: Request, resp: Response) => {
  interface RequestBody {
    email: string;
    name: string;
    phone: string;
    location: string;
  }

  const body: RequestBody = req.body;
  const { email, name, phone, location } = body;

  if (!email || !name || !phone || !location) {
    return resp.status(400).json({
      message: "Email, phone, name and location cannot be null or blank",
    });
  }

  try {
    const newDriver = await prisma.driver.create({
      data: {
        email: email,
        name: name,
        phone: phone,
        location: location,
      },
    });
    return resp.status(201).json(newDriver);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error);
      if (error.code === "P2002") {
        return resp
          .status(400)
          .json({ message: `Values exists for ${error.meta?.target}` });
      }
    }

    return resp.status(500).json({ message: "Something went wrong" });
  }
};

export const editDriver = async (req: Request, resp: Response) => {
  interface RequestBody {
    email?: string;
    name?: string;
    phone?: string;
    location?: string;
    vehicle?: string; // New field for vehicle
  }

  const { id } = req.params; // Assuming the driver ID is passed as a URL parameter
  const { email, name, phone, location, vehicle } = req.body;

  // Check if at least one field is provided for update
  if (!email && !name && !phone && !location && !vehicle) {
    return resp.status(400).json({
      message:
        "At least one field (email, phone, name, location, or vehicle) must be provided to update",
    });
  }

  try {
    const updatedDriver = await prisma.driver.update({
      where: {
        id: Number(id), // Assuming id is a number. Adjust according to your schema if different.
      },
      data: {
        email: email || undefined,
        name: name || undefined,
        phone: phone || undefined,
        location: location || undefined,
      },
    });
    return resp.status(200).json(updatedDriver);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to update not found
        return resp.status(404).json({ message: "Driver not found" });
      } else if (error.code === "P2002") {
        // Unique constraint violation
        return resp
          .status(400)
          .json({ message: `Values exists for ${error.meta?.target}` });
      }
    }

    return resp.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteDriver = async (req: Request, resp: Response) => {
  const { id } = req.params; // Assuming the driver ID is passed as a URL parameter

  try {
    const deletedDriver = await prisma.driver.delete({
      where: {
        id: Number(id), // Assuming id is a number. Adjust according to your schema if different.
      },
    });
    return resp.status(200).json({
      message: "Driver successfully deleted",
      driver: deletedDriver,
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to delete not found
        return resp.status(404).json({ message: "Driver not found" });
      }
      // Handle other known errors if needed
    }

    return resp.status(500).json({ message: "Something went wrong" });
  }
};
