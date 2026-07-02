import { useQuery } from "@tanstack/react-query"
import { getPatients } from "@/services/patients.service"


export default function Dashboard() {

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Total patients</h2>
      <p>{patients?.length ?? 0}</p>
    </div>
  )

}