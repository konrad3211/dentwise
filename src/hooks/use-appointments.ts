"use client";

import {
  bookAppointment,
  getAppointments,
  getBookedTimeSlots,
  getUserAppointments,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAppointments = () => {
  const result = useQuery({
    queryKey: ["getAppointments"],
    queryFn: getAppointments,
  });
  return result;
};

export const useBookedTimeSlots = (doctorId: string, date: string) => {
  const result = useQuery({
    queryKey: ["getBookedTimeSlots", doctorId, date],
    queryFn: () => getBookedTimeSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
  return result;
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserAppointments"] });
    },
    onError: (error) => console.error("Failed to book appointment", error),
  });
};

export const useUserAppointments = () => {
  const result = useQuery({
    queryKey: ["getUserAppointments"],
    queryFn: getUserAppointments,
  });
  return result;
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAppointments"] });
    },
    onError: (error) => console.log("Failed to update appointment", error),
  });
};
