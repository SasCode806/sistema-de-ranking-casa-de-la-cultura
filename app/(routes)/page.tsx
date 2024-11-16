"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, Medal, Trophy } from "lucide-react";
import { Volunteer } from "@/types";
import { getVolunteers } from "@/actons/volunteer";
import NavbarAdmin from "@/components/admin/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { isTeacher } from "@/lib/admin";
import Link from "next/link";

export default function UserRanking() {
  const { userId } = useAuth();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const fetchVolunteers = async () => {
    try {
      const res = await getVolunteers();
      setVolunteers(res);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Image
                src={"/img/ligth-img.png"}
                alt="logo"
                width={100}
                height={300}
                className=""
              />
            </div>
            <div className=" flex justify-center items-center gap-8">
              {isTeacher(userId) && (
                <div>
                  <Link href={"/admin"}>
                    <Button>Panel Administrador</Button>
                  </Link>
                </div>
              )}
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      <div className=" bg-gray-100 min-h-screen py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Clasificación de voluntarios
              </CardTitle>
              <CardDescription className="text-center">
                Los mejores en nuestro programa de voluntariado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {volunteers
                  .sort(
                    (a, b) =>
                      (b.scores[0]?.average || 0) - (a.scores[0]?.average || 0)
                  )
                  .map((volunteer, index) => (
                    <div
                      key={volunteer.id}
                      className="flex items-center p-4 border rounded-lg  transition-colors"
                    >
                      <div className="flex-none w-8 text-xl font-bold">
                        {getRankIcon(index) || `${index + 1}.`}
                      </div>
                      <div className="flex-grow">
                        <div className="font-semibold text-lg">
                          {volunteer.name}
                        </div>
                        {/* Quitar puntaje de calificacion de criterios */}
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className={getScoreColor(
                              volunteer.scores[0]?.participation
                            )}
                            title="Participation" // Added tooltip
                          >
                            P: {volunteer.scores[0]?.participation}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={getScoreColor(
                              volunteer.scores[0]?.autonomy
                            )}
                            title="Autonomía" // Added tooltip
                          >
                            A: {volunteer.scores[0]?.autonomy}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={getScoreColor(
                              volunteer.scores[0]?.proactivity
                            )}
                            title="Proactividad" // Added tooltip
                          >
                            PR: {volunteer.scores[0]?.proactivity}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={getScoreColor(
                              volunteer.scores[0]?.discipline
                            )}
                            title="Disciplina" // Added tooltip
                          >
                            D: {volunteer.scores[0]?.discipline}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={getScoreColor(
                              volunteer.scores[0]?.constancy
                            )}
                            title="Constancia" // Added tooltip
                          >
                            C: {volunteer.scores[0]?.constancy}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-none w-24 text-right">
                        <Badge
                          className={`text-lg hover:bg-blue-200 ${getScoreColor(
                            volunteer.scores[0]?.average
                          )}`}
                        >
                          {volunteer.scores[0]?.average.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
