import { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

export const searchBookings = async (req: Request, resp: Response) => {
  interface BookingSearchQuery {
    driverId?: number;
    vehicleId?: number;
    startAfter?: string;
    startBefore?: string;
    endAfter?: string;
    endBefore?: string;
    status?: string;
  }
  // Extract query parameters for name and phone
  const query: BookingSearchQuery = req.query;
  // Extract query parameters for name and phone
  const { driverId, vehicleId, startAfter, startBefore, endAfter, endBefore } =
    query;
  try {
    // Fetch vehicles based on the filter
    const bookings = await prisma.booking.findMany({
      where: {
        driverId: Number(driverId) || undefined,
        assignment: {
          vehicleId: Number(driverId) || undefined,
          startStamp: {
            gt: startAfter || undefined,
            lt: startBefore || undefined,
          },
          endStamp: {
            gt: endAfter || undefined,
            lt: endBefore || undefined,
          },
        },
      },
      select: {
        id: true,
        driver: {
          select: {
            name: true,
          },
        },
        assignment: {
          select: {
            vehicle: {
              select: {
                plate: true,
              },
            },
            startStamp: true,
            endStamp: true,
          },
        },
        status: true,
      },
    });

    if (bookings.length === 0) {
      return resp
        .status(404)
        .json({ message: "No Bookings found matching the criteria" });
    }

    return resp.status(200).json(bookings); // Return the search results
  } catch (error: unknown) {
    console.error("Error searching vehicles:", error);
    return resp.status(500).json({ message: "Something went wrong" }); // Handle any unexpected errors
  }
};

export const createBooking = async (req: Request, resp: Response) => {
  interface CreateBookingRequestBody {
    driverId: number;
    assignmentId: number;
  }

  const body: CreateBookingRequestBody = req.body;
  const { driverId, assignmentId } = body;

  // Validate input
  if (!driverId || !assignmentId) {
    return resp.status(400).json({
      message: "All fields are required: driverId, assignmentId",
    });
  }

  const assignment = await prisma.assignment.findUniqueOrThrow({
    where: {
      id: assignmentId,
    },
  });

  try {
    // Check if driver is available
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        driverId: driverId,
        assignment: {
          OR: [
            {
              startStamp: {
                gt: assignment.startStamp,
                lt: assignment.endStamp,
              },
            },
            {
              endStamp: {
                gt: assignment.startStamp,
                lt: assignment.endStamp,
              },
            },
            {
              startStamp: {
                lt: assignment.startStamp,
              },
              endStamp: {
                gt: assignment.endStamp,
              },
            },
          ],
        },
        status: "Accepted",
      },
    });

    if (overlappingBookings.length > 0) {
      return resp.status(400).json({
        message: "Driver is not available for the given time frame",
      });
    }

    // Create the booking if both are available
    const newBooking = await prisma.booking.create({
      data: {
        driverId,
        assignmentId,
      },
    });

    return resp.status(201).json(newBooking);
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteBooking = async (req: Request, resp: Response) => {
  const { id } = req.params; // Assuming the booking ID is passed as a URL parameter

  try {
    const deletedBooking = await prisma.booking.delete({
      where: {
        id: Number(id), // Assuming id is a number. Adjust according to your schema if different.
      },
    });
    return resp.status(200).json({
      message: "Booking successfully deleted",
      vehicle: deletedBooking,
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to delete not found
        return resp.status(404).json({ message: "Booking not found" });
      }
      // Handle other known errors if needed
    }

    return resp.status(500).json({ message: "Something went wrong" });
  }
};

export const getBookingById = async (req: Request, resp: Response) => {
  const { id } = req.params; // Assuming the booking ID is passed as a URL parameter

  try {
    // Fetch the booking with the given ID
    const booking = await prisma.booking.findUnique({
      where: {
        id: Number(id), // Convert ID to number if it's a numeric ID
      },
    });

    if (!booking) {
      return resp.status(404).json({ message: "Booking not found" });
    }

    return resp.status(200).json(booking); // Return the vehicle in the response
  } catch (error: unknown) {
    console.error("Error fetching vehicle:", error);
    return resp.status(500).json({ message: "Something went wrong" }); // Handle any unexpected errors
  }
};

export const changeStatus = async (req: Request, resp: Response) => {
  const { id } = req.params; // Assuming the booking ID is passed as a URL parameter

  try {
    if (
      req.body.status != "Accepted" &&
      req.body.status != "Rejected" &&
      req.body.status != "Pending"
    ) {
      return resp.status(400).json({ message: "Invalid status" });
    }
    const updatedBooking = await prisma.booking.update({
      where: {
        id: Number(id),
      },
      data: {
        status: req.body.status,
      },
    });

    return resp.status(200).json(updatedBooking); // Return the vehicle in the response
  } catch (error: unknown) {
    console.error("Error fetching vehicle:", error);
    return resp.status(500).json({ message: "Something went wrong" }); // Handle any unexpected errors
  }
};
