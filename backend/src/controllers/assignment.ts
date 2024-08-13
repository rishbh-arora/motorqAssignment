import { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

const createAssignment = async (req: Request, resp: Response) => {
  const { startStamp, endStamp, vehicleId } = req.body;

  if (!startStamp || !endStamp || !vehicleId) {
    resp.status(400).json({
      message: "All fields required: startStamp, endStamp, vehicleId",
    });
  }

  const startDateTime = new Date(startStamp);
  const endDateTime = new Date(endStamp);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    return resp.status(400).json({ message: "Invalid date format" });
  }

  try {
    const vehicleBusy = await prisma.assignment.findMany({
      where: {
        vehicleId: vehicleId,
        OR: [
          {
            startStamp: {
              gt: startStamp,
              lt: endStamp,
            },
          },
          {
            endStamp: {
              gt: startStamp,
              lt: endStamp,
            },
          },
          {
            startStamp: {
              lt: startStamp,
            },
            endStamp: {
              gt: endStamp,
            },
          },
        ],
      },
    });

    if (vehicleBusy.length > 0) {
      return resp
        .status(400)
        .json({ message: "Vehicle not available for the given time" });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        startStamp: new Date(startStamp),
        endStamp: new Date(endStamp),
        vehicleId,
      },
    });
    resp.json(newAssignment);
  } catch (error) {
    resp.status(500).json({ error: "Failed to create assignment" });
  }
};
