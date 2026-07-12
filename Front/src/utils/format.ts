

//funcion para formatear la fecha en formato dd/mm/yyyy

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


//funcion para calcular la edad a partir de la fecha de nacimiento
export function calculateAge(dateString: string): number {
  const today = new Date();
  const birth = new Date(dateString);

  let age = today.getFullYear() - birth.getFullYear();

  //si todavia no cumplio años este año le resto uno
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}