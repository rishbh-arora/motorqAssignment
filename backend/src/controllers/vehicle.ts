import { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

export const getVehicleById = async (req: Request, resp: Response) => {
  const { id } = req.params; // Assuming the Vehicle ID is passed as a URL parameter

  try {
    // Fetch the vehicle with the given ID
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: Number(id), // Convert ID to number if it's a numeric ID
      },
      select: {
        plate: true,
        model: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!vehicle) {
      return resp.status(404).json({ message: "Vehicle not found" });
    }

    return resp.status(200).json(vehicle); // Return the vehicle in the response
  } catch (error: unknown) {
    console.error("Error fetching vehicle:", error);
    return resp.status(500).json({ message: "Something went wrong" }); // Handle any unexpected errors
  }
};

export const searchVehicles = async (req: Request, resp: Response) => {
  interface ReqQuery {
    plate?: string;
    model?: string;
  }
  // Extract query parameters for name and phone
  const query: ReqQuery = req.query;
  const { plate, model } = query;
  try {
    // Fetch vehicles based on the filter
    const vehicles = await prisma.vehicle.findMany({
      where: {
        model: {
          name: {
            contains: model, // Partial match
            mode: "insensitive", // Case-insensitive search
          },
        },
        plate: { contains: plate, mode: "insensitive" },
      },
      select: {
        plate: true,
        model: {
          select: {
            name: true,
          },
        },
      },
    });

    if (vehicles.length === 0) {
      return resp
        .status(404)
        .json({ message: "No vehicles found matching the criteria" });
    }

    return resp.status(200).json(vehicles); // Return the search results
  } catch (error: unknown) {
    console.error("Error searching vehicles:", error);
    return resp.status(500).json({ message: "Something went wrong" }); // Handle any unexpected errors
  }
};

export const createVehicle = async (req: Request, resp: Response) => {
  interface VehicleBody {
    modelID: number;
    plate: string;
  }

  const body: VehicleBody = req.body;
  const { modelID, plate } = body;

  if (!modelID || !plate) {
    return resp.status(400).json({
      message: "Model and license plate cannot be null or blank",
    });
  }

  try {
    const newVehicle = await prisma.vehicle.create({
      data: {
        modelID,
        plate,
      },
    });
    return resp.status(201).json(newVehicle);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        // Handle foreign key constraint error
        return resp.status(400).json({
          message: `Model with ID ${modelID} does not exist.`,
        });
      }
      if (error.code === "P2002") {
        // Handle foreign key constraint error
        return resp.status(400).json({
          message: `A vehicle with plate ${plate} already exists.`,
        });
      }
    }
    console.error("Error creating vehicle:", error);
    return resp.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteVehicle = async (req: Request, resp: Response) => {
  const { id } = req.params; // Assuming the vehicle ID is passed as a URL parameter

  try {
    const deletedVehicle = await prisma.vehicle.delete({
      where: {
        id: Number(id), // Assuming id is a number. Adjust according to your schema if different.
      },
    });
    return resp.status(200).json({
      message: "Vehicle successfully deleted",
      vehicle: deletedVehicle,
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to delete not found
        return resp.status(404).json({ message: "Vehicle not found" });
      }
      // Handle other known errors if needed
    }

    return resp.status(500).json({ message: "Something went wrong" });
  }
};
