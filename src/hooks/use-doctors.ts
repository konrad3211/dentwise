"use client";

import {
  createDoctor,
  getAvailableDoctors,
  getDoctors,
  updateDoctor,
} from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDoctors = () => {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });

  return result;
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const res = useMutation({
    mutationFn: createDoctor,
    //invalidate realated queries to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
    },
    onError: (error) => console.log("Error while creating a doctor"),
  });

  return res;
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  const res = useMutation({
    mutationFn: updateDoctor,
    //invalidate realated queries to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["getAvailableDoctors"] });
    },
    onError: (error) => console.log("Error while updating a doctor"),
  });

  return res;
};

export const useAvailableDoctors = () => {
  const result = useQuery({
    queryKey: ["getAvailableDoctors"],
    queryFn: getAvailableDoctors,
  });
  return result;
};
