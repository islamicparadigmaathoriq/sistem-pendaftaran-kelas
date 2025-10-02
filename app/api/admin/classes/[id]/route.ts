// file: app/api/admin/classes/[id]/route.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "../../../middleware/auth";

const prisma = new PrismaClient();

/**
 * Handler UPDATE (PUT)
 */
const updateClass = async (
  req: Request,
  { params }: { params: { id: string } } // ✅ pakai params dari context (tidak diubah)
) => {
  try {
    const { id } = params;
    console.log("UpdateClass params:", params); // // ✅ tambahan log biar debug gampang

    if (!id) {
      return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
    }

    const { name, quota, description, trainingDate } = await req.json();

    // // ✅ validasi quota ditambahkan lebih ketat
    if (!name || !quota || typeof quota !== "number" || quota <= 0) {
      return NextResponse.json(
        { message: "Invalid data for class update" },
        { status: 400 }
      );
    }

    const updatedClass = await prisma.class.update({
      where: { id }, // // ✅ pastikan id string UUID sesuai schema prisma
      data: {
        name,
        quota,
        description,
        trainingDate: trainingDate ? new Date(trainingDate) : null,
      },
    });

    return NextResponse.json(updatedClass, { status: 200 });
  } catch (error) {
    console.error("Error updating class:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Class not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Something went wrong while updating the class." },
      { status: 500 }
    );
  }
};

/**
 * Handler DELETE
 */
const deleteClass = async (
  req: Request,
  { params }: { params: { id: string } } // ✅ params ikut diteruskan
) => {
  try {
    const { id } = params;
    console.log("DeleteClass params:", params); // // ✅ tambahan log debug

    if (!id) {
      return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
    }

    await prisma.class.delete({ where: { id } }); // ✅ id langsung UUID string

    return NextResponse.json({ message: "Class deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Class not found." }, { status: 404 });
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { message: "Cannot delete class with existing registrations." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: "Something went wrong while deleting the class." },
      { status: 500 }
    );
  }
};

// ✅ ADMIN only lewat middleware
export const PUT = authMiddleware(updateClass, ["ADMIN", "STAFF"]); // // sama seperti sebelumnya
export const DELETE = authMiddleware(deleteClass, ["ADMIN", "STAFF"]); // // sama seperti sebelumnya
