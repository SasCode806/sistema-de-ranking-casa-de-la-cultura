"use server";

import { formSchema } from "@/components/admin/modal-add";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ScoreSchema = z.object({
  participation: z.number().min(0).max(100),
  autonomy: z.number().min(0).max(100),
  proactivity: z.number().min(0).max(100),
  discipline: z.number().min(0).max(100),
  constancy: z.number().min(0).max(100),
});

export async function addVolunteer(values: z.infer<typeof formSchema>) {
  const { userId } = await auth();
  const { name } = values;

  if (!userId) {
    throw new Error("No autorizado");
  }

  if (!name) {
    return { error: "Name is required" };
  }

  try {
    await db.volunteer.create({
      data: {
        name,
        scores: {
          create: {
            participation: 0,
            autonomy: 0,
            proactivity: 0,
            discipline: 0,
            constancy: 0,
            average: 0,
          },
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    throw new Error("Error al crear voluntario");
  }
}

//buscar volunter
export async function getVolunteers() {
  try {
    return await db.volunteer.findMany({
      where: { active: true },
      include: {
        scores: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        scores: {
          _count: "desc", // or try using "_sum"
        },
      },
    });
  } catch (error) {
    throw new Error("Error al obtener voluntarios");
  }
}

//UpdateScore
export async function updateVolunteerScore(
    volunteerId: string,
    field: 'participation' | 'autonomy' | 'proactivity' | 'discipline' | 'constancy',
    value: number
  ) {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error("No autorizado");
    }
  
    try {
      const volunteer = await db.volunteer.findUnique({
        where: { id: volunteerId },
        include: { scores: { take: 1, orderBy: { createdAt: 'desc' } } }
      });
  
      if (!volunteer) throw new Error("Voluntario no encontrado");
  
      const scoreId = volunteer.scores[0]?.id;
      
      if (!scoreId) throw new Error("Score no encontrado");
  
      // Update the specific field
      const updates = { [field]: value };
      
      // Calculate new average
      const currentScore = volunteer.scores[0];
      const scores = {
        participation: field === 'participation' ? value : currentScore.participation,
        autonomy: field === 'autonomy' ? value : currentScore.autonomy,
        proactivity: field === 'proactivity' ? value : currentScore.proactivity,
        discipline: field === 'discipline' ? value : currentScore.discipline,
        constancy: field === 'constancy' ? value : currentScore.constancy,
      };
      
      const newAverage = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
  
      // Update score
      await db.score.update({
        where: { id: scoreId },
        data: {
          ...updates,
          average: newAverage
        }
      });
  
      revalidatePath("/admin");
      revalidatePath("/");
      
      return { success: true };
    } catch (error) {
      console.error(error);
      throw new Error("Error al actualizar puntuación");
    }
  }


  // delete
  export async function deleteVolunteer(id: string) {
    const {userId} = await auth();
    if (!userId) {
      throw new Error('No autorizado');
    }
   
    try {
      await db.volunteer.delete({
        where: { id }
      });
  
      revalidatePath('/admin');
      revalidatePath('/');
    } catch (error) {
      throw new Error('Error al eliminar voluntario');
    }
  }
  