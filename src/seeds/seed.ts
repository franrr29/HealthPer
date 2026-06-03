
// Datos de doctores, pacientes y consultas falsos creados con faker

import "dotenv/config"
import { conexionDB } from "../config/db"
import { faker } from "@faker-js/faker"
import { logger } from "../config/logger"
import bcrypt from "bcrypt"
import { transcripts } from "./transcripts/transcripts"



async function seed() {
  try {

    // limpiar tablas para no duplicar datos
    await conexionDB.execute("SET FOREIGN_KEY_CHECKS = 0")
    await conexionDB.execute("DELETE FROM consultations")
    await conexionDB.execute("DELETE FROM patients")
    await conexionDB.execute("DELETE FROM doctors")
    await conexionDB.execute("SET FOREIGN_KEY_CHECKS = 1")

    // hash contraseña doctores:
    const passwordHash = await bcrypt.hash("password123", 12)


    //especialidades de los doctores creados:
    const specialties = [
      "Cardiology", "Pediatrics", "Neurology", "General Medicine",
      "Gynecology", "Traumatology", "Dermatology", "Psychiatry",
      "Oncology", "Endocrinology"
    ]

    const summaries = [
      {
        summary: "Patient shows signs of acute myocardial infarction. Immediate intervention required.",
        possible_considerations: ["Cardiac catheterization", "Aspirin therapy"],
        follow_up: ["Cardiology referral in 48 hours"],
        medications_mentioned: ["Aspirin", "Nitroglycerin"]
      },
      {
        summary: "Hypertension not well controlled. Lifestyle modifications and medication adjustment needed.",
        possible_considerations: ["DASH diet", "Reduce sodium intake"],
        follow_up: ["Blood pressure check in 2 weeks"],
        medications_mentioned: ["Lisinopril"]
      },
      {
        summary: "Respiratory infection suspected. No signs of pneumonia. Conservative treatment recommended.",
        possible_considerations: ["Viral vs bacterial etiology"],
        follow_up: ["Return if symptoms worsen"],
        medications_mentioned: ["Azithromycin"]
      },
      {
        summary: "Hypothyroidism suspected based on symptoms. Lab results pending.",
        possible_considerations: ["TSH levels", "Free T4"],
        follow_up: ["Review labs in 1 week"],
        medications_mentioned: ["Levothyroxine"]
      },
      {
        summary: "Sports injury, no fracture detected. Physical therapy recommended.",
        possible_considerations: ["MRI if no improvement"],
        follow_up: ["Orthopedic follow-up in 4 weeks"],
        medications_mentioned: ["Ibuprofen"]
      },
      {
        summary: "Possible hypertensive emergency. Immediate blood pressure management required.",
        possible_considerations: ["Rule out stroke", "Ophthalmology consult"],
        follow_up: ["Neurology referral", "24h blood pressure monitoring"],
        medications_mentioned: ["Labetalol", "Amlodipine"]
      },
      {
        summary: "Poorly controlled Type 2 diabetes. Medication adjustment and dietary counseling needed.",
        possible_considerations: ["Nephropathy screening", "Retinal exam"],
        follow_up: ["Endocrinology in 1 month", "HbA1c recheck"],
        medications_mentioned: ["Metformin", "Insulin glargine"]
      },
      {
        summary: "Allergic contact dermatitis, likely triggered by new detergent. Topical treatment initiated.",
        possible_considerations: ["Patch testing", "Rule out eczema"],
        follow_up: ["Dermatology if no improvement in 2 weeks"],
        medications_mentioned: ["Hydrocortisone", "Cetirizine"]
      },
      {
        summary: "Early signs of cognitive decline. Further neuropsychological testing recommended.",
        possible_considerations: ["Alzheimer screening", "Vascular dementia"],
        follow_up: ["Neurology referral", "Brain MRI"],
        medications_mentioned: ["Donepezil"]
      },
      {
        summary: "Lumbar strain, no disc involvement. Conservative management appropriate.",
        possible_considerations: ["Disc herniation if no improvement"],
        follow_up: ["Physical therapy 2x per week for 4 weeks"],
        medications_mentioned: ["Naproxen", "Cyclobenzaprine"]
      }
    ]

    // Crear 10 doctores
    const doctores = Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: passwordHash,
      specialty: faker.helpers.arrayElement(specialties),
      role: "doctor"
    }))

    const doctorIds: number[] = []

    for (const doctor of doctores) {
      const [result] = await conexionDB.execute(
        `INSERT INTO doctors (name, email, password_hash, specialty, role)
         VALUES (?, ?, ?, ?, ?)`,
        [doctor.name, doctor.email, doctor.password_hash, doctor.specialty, doctor.role]
      )
      doctorIds.push((result as any).insertId)
    }

    logger.info("10 doctores creados")

    // Crear 5 pacientes por doctor
    const patientIds: number[] = []

    for (const doctorId of doctorIds) {
      const pacientes = Array.from({ length: 5 }, () => ({
        doctor_id: doctorId,
        name: faker.person.fullName(),
        birth_date: faker.date.birthdate({ min: 18, max: 95, mode: "age" }),
        gender: faker.helpers.arrayElement(["M", "F", "X", "U"]),
        national_id: faker.string.numeric(8),
        phone: faker.phone.number()
      }))

      for (const paciente of pacientes) {
        const [result] = await conexionDB.execute(
          `INSERT INTO patients (doctor_id, name, birth_date, gender, national_id, phone)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [paciente.doctor_id, paciente.name, paciente.birth_date, paciente.gender, paciente.national_id, paciente.phone]
        )
        patientIds.push((result as any).insertId)
      }
    }

    logger.info("50 pacientes creados")

    // Crear 7 consultas por paciente
    for (const patientId of patientIds) {
      const historia = faker.helpers.arrayElement(transcripts)
      for (let i = 0; i < 7; i++) {
         await conexionDB.execute(
          `INSERT INTO consultations (patient_id, doctor_id, transcript, ai_summary, status)
           VALUES (?, ?, ?, ?, ?)`,
           [
             patientId,
             doctorIds[Math.floor(Math.random() * doctorIds.length)],
             historia[i],  
             JSON.stringify(faker.helpers.arrayElement(summaries)),
             faker.helpers.arrayElement(["draft", "reviewed", "signed"])
             ]
            )
          }
        }
        
        logger.info("350 consultas creadas");
        
        logger.info({
          doctors: doctorIds.length,
          patients: patientIds.length
        }, "Seed completado")
      
      } catch (error) {
        
        logger.error(error, "Error en seed")
      
      } finally {
        
        process.exit(0)
      
      }
    }

seed()
