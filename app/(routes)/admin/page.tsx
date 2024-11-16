"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import debounce from "lodash/debounce";
import {
  Trophy,
  Medal,
  Award,
  Star,
  Activity,
  Brain,
  Target,
  Clock,
} from "lucide-react";
import NavbarAdmin from "@/components/admin/navbar";
import { DialogDemo } from "@/components/admin/modal-add";
import {
  deleteVolunteer,
  getVolunteers,
  updateVolunteerScore,
} from "@/actons/volunteer";
import { Volunteer } from "@/types";

type ScoreField =
  | "participation"
  | "autonomy"
  | "proactivity"
  | "discipline"
  | "constancy";

const DemoVolunteersSystem = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [localScores, setLocalScores] = useState<
    Record<string, Record<string, string>>
  >({});

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        async (volunteerId: string, field: ScoreField, value: number) => {
          try {
            await updateVolunteerScore(volunteerId, field, value);
            await fetchVolunteers();
          } catch (error) {
            console.error("Error updating score:", error);
          }
        },
        1000
      ),
    []
  );

  const handleScoreChange = (
    volunteerId: string,
    field: ScoreField,
    value: string
  ) => {
    // Actualizar estado local inmediatamente
    setLocalScores((prev) => ({
      ...prev,
      [volunteerId]: {
        ...(prev[volunteerId] || {}),
        [field]: value,
      },
    }));

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      debouncedUpdate(volunteerId, field, numValue);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

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

  const fetchVolunteers = async () => {
    try {
      const res = await getVolunteers();
      setVolunteers(res);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const renderScoreInput = (volunteer: Volunteer, field: ScoreField) => {
    const value =
      localScores[volunteer.id]?.[field] !== undefined
        ? localScores[volunteer.id][field]
        : volunteer.scores[0]?.[field]?.toString() || "";

    return (
      <Input
        type="number"
        value={value}
        className="w-20 mx-auto"
        onChange={(e) => handleScoreChange(volunteer.id, field, e.target.value)}
        min={0}
        max={100}
      />
    );
  };

  const deleteId = async (id: string) => {
    await deleteVolunteer(id);
    fetchVolunteers();
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <NavbarAdmin />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Panel de Administración</TabsTrigger>
            <TabsTrigger value="leaderboard">Vista Pública</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid gap-6">
              <DialogDemo onVolunteerAdded={fetchVolunteers} />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Gestión de Calificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Nombre</th>
                          <th className="text-center py-3 px-4">
                            <div className="flex items-center justify-center">
                              <Activity className="w-4 h-4 mr-2" />
                              Participación
                            </div>
                          </th>
                          <th className="text-center py-3 px-4">
                            <div className="flex items-center justify-center">
                              <Brain className="w-4 h-4 mr-2" />
                              Autonomía
                            </div>
                          </th>
                          <th className="text-center py-3 px-4">
                            <div className="flex items-center justify-center">
                              <Star className="w-4 h-4 mr-2" />
                              Proactividad
                            </div>
                          </th>
                          <th className="text-center py-3 px-4">
                            <div className="flex items-center justify-center">
                              <Target className="w-4 h-4 mr-2" />
                              Disciplina
                            </div>
                          </th>
                          <th className="text-center py-3 px-4">
                            <div className="flex items-center justify-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Constancia
                            </div>
                          </th>
                          <th className="text-center py-3 px-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers.map((volunteer) => (
                          <tr key={volunteer.id} className="border-b">
                            <td className="py-3 px-4">{volunteer.name}</td>
                            <td className="py-3 px-4">
                              {renderScoreInput(volunteer, "participation")}
                            </td>
                            <td className="py-3 px-4">
                              {renderScoreInput(volunteer, "autonomy")}
                            </td>
                            <td className="py-3 px-4">
                              {renderScoreInput(volunteer, "proactivity")}
                            </td>
                            <td className="py-3 px-4">
                              {renderScoreInput(volunteer, "discipline")}
                            </td>
                            <td className="py-3 px-4">
                              {renderScoreInput(volunteer, "constancy")}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteId(volunteer.id)}
                              >
                                Eliminar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Tablero de Reconocimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {volunteers
                    .sort(
                      (a, b) =>
                        (b.scores[0]?.average || 0) -
                        (a.scores[0]?.average || 0)
                    )
                    .map((volunteer, index) => (
                      <div
                        key={volunteer.id}
                        className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-none w-8 text-xl font-bold">
                          {getRankIcon(index) || `${index + 1}.`}
                        </div>
                        <div className="flex-grow">
                          <div className="font-semibold text-lg">
                            {volunteer.name}
                          </div>
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className={getScoreColor(
                                volunteer.scores[0]?.participation
                              )}
                            >
                              P: {volunteer.scores[0]?.participation}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={getScoreColor(
                                volunteer.scores[0]?.autonomy
                              )}
                            >
                              A: {volunteer.scores[0]?.autonomy}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={getScoreColor(
                                volunteer.scores[0]?.proactivity
                              )}
                            >
                              PR: {volunteer.scores[0]?.proactivity}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={getScoreColor(
                                volunteer.scores[0]?.discipline
                              )}
                            >
                              D: {volunteer.scores[0]?.discipline}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={getScoreColor(
                                volunteer.scores[0]?.constancy
                              )}
                            >
                              C: {volunteer.scores[0]?.constancy}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex-none w-24 text-right">
                          <Badge
                            className={`text-lg ${getScoreColor(
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DemoVolunteersSystem;
