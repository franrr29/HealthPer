//seed para demo login de recruiters
//despues de correr este script correr seedIndexing.ts para chunks + embeddings

import "dotenv/config";
import { conexionDB } from "../config/db";
import { logger } from "../config/logger";
import bcrypt from "bcrypt";

const DEMO_EMAIL = "demo@demo.com";

async function seedDemo() {
  try {

    //buscar si ya existe el doctor demo para limpiar sus datos
    const [existingDemo] = await conexionDB.query<any[]>(
      "SELECT id FROM doctors WHERE email = ?",
      [DEMO_EMAIL]
    );

    if (existingDemo.length > 0) {
      const demoDoctorId = existingDemo[0].id;

      //sacar ids de pacientes del demo
      const [demoPatients] = await conexionDB.query<any[]>(
        "SELECT id FROM patients WHERE doctor_id = ?",
        [demoDoctorId]
      );

      const patientIds = demoPatients.map((p: any) => p.id);

      //borrar todo lo del demo en orden por foreign keys
      if (patientIds.length > 0) {
        await conexionDB.execute(
          `DELETE FROM consultation_chunks WHERE patient_id IN (${patientIds.join(",")})`
        );
        await conexionDB.execute(
          `DELETE FROM patient_memory WHERE patient_id IN (${patientIds.join(",")})`
        );
        await conexionDB.execute(
          `DELETE FROM consultations WHERE patient_id IN (${patientIds.join(",")})`
        );
        await conexionDB.execute(
          `DELETE FROM patients WHERE doctor_id = ?`,
          [demoDoctorId]
        );
      }

      await conexionDB.execute("DELETE FROM doctors WHERE id = ?", [demoDoctorId]);
      logger.info("datos demo anteriores eliminados");
    }

    //crear doctor demo
    const passwordHash = await bcrypt.hash("demo123", 12);

    const [doctorResult] = await conexionDB.execute<any>(
      `INSERT INTO doctors (name, email, password_hash, specialty, role)
       VALUES (?, ?, ?, ?, ?)`,
      ["Dr. Demo", DEMO_EMAIL, passwordHash, "General Medicine", "doctor"]
    );

    const doctorId = doctorResult.insertId;
    logger.info(`doctor demo creado | id: ${doctorId}`);

    //crear pacientes demo
    const patients = [
      {
        name: "Maria Lopez",
        birth_date: "1985-03-15",
        gender: "F",
        national_id: "12345678",
        phone: "+598 99 123 456",
      },
      {
        name: "Carlos Mendez",
        birth_date: "1972-08-22",
        gender: "M",
        national_id: "87654321",
        phone: "+598 99 654 321",
      },
      {
        name: "Ana Rodriguez",
        birth_date: "1990-11-05",
        gender: "F",
        national_id: "11223344",
        phone: "+598 99 789 012",
      },
      {
        name: "Sofia Herrera",
        birth_date: "1996-05-12",
        gender: "F",
        national_id: "55667788",
        phone: "+598 99 234 567",
      },
      {
        name: "Jorge Ramirez",
        birth_date: "1980-09-03",
        gender: "M",
        national_id: "99887766",
        phone: "+598 99 345 678",
      },
    ];

    const patientIds: number[] = [];

    for (const patient of patients) {
      const [result] = await conexionDB.execute<any>(
        `INSERT INTO patients (doctor_id, name, birth_date, gender, national_id, phone)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [doctorId, patient.name, patient.birth_date, patient.gender, patient.national_id, patient.phone]
      );
      patientIds.push(result.insertId);
    }

    logger.info(`${patientIds.length} pacientes demo creados`);

    //consultas con transcripts y ai_summary
    const consultationData = [

      //maria lopez - hipertension
      {
        patientIndex: 0,
        consultations: [
          {
            transcript:
              "Doctor: Good morning Maria, how have you been feeling lately? Patient: Good morning doctor. To be honest, not great. I've been having these headaches almost every day, especially when I wake up in the morning. They're usually right here in the back of my head. And when I stand up too fast I get really dizzy, like the room is spinning. Doctor: I see. How long has this been going on? Patient: It started about three weeks ago. At first I thought it was just stress from work, you know, I've been pulling extra hours. But it's been getting worse, not better. Last Tuesday I almost fainted getting out of bed. Doctor: That's concerning. Have you noticed any other symptoms? Any chest pain, shortness of breath, changes in vision? Patient: No chest pain, but actually now that you mention it, sometimes my vision gets a little blurry when the headache is really bad. Doctor: Let me take your blood pressure. I'm going to check both arms. Alright, your left arm is reading 168/96 and your right arm is 165/95. Both are significantly elevated. Maria, have you ever been told you have high blood pressure before? Patient: No, never. I haven't been to a doctor in maybe two years. Doctor: Are you currently taking any medications or supplements? Patient: Just a multivitamin sometimes. Nothing prescription. Doctor: Any family history of high blood pressure or heart disease? Patient: Actually yes, my father has been on blood pressure medication for years. He had a small stroke when he was 60. Doctor: That's important information. Alright Maria, your blood pressure is in what we call stage 2 hypertension. We need to address this right away. I'm going to start you on Lisinopril 10mg, which is an ACE inhibitor. You'll take it once daily in the morning. I also need you to make some lifestyle changes. Reduce your sodium intake, try to stay under 2 grams per day. That means cutting back on processed foods, canned soups, restaurant food. And I want you to start walking at least 30 minutes a day, five days a week. Patient: Should I be worried? Is this serious? Doctor: High blood pressure is serious if left untreated, but the good news is it's very manageable. With medication and lifestyle changes, most patients get it under control. I want to see you back in two weeks to recheck your pressure and see how you're responding to the medication. If you experience any swelling in your face or tongue, or a persistent dry cough, call us right away. Patient: Okay doctor, I understand. Two weeks. Doctor: And I'm ordering some blood work too. I want to check your kidney function and electrolytes since we're starting the ACE inhibitor. The lab is downstairs, you can do it today before you leave.",
            ai_summary: {
              summary: "Patient presents with a 3-week history of persistent morning occipital headaches and positional dizziness, with one near-syncopal episode. Reports occasional blurred vision during severe headaches. Blood pressure significantly elevated bilaterally at 168/96 and 165/95 mmHg. No prior diagnosis of hypertension. Has not seen a doctor in two years. Family history significant for paternal hypertension and stroke at age 60. No current medications. No chest pain or dyspnea. Starting antihypertensive therapy with close follow-up.",
              chief_complaint: "Daily morning headaches for 3 weeks with positional dizziness and near-syncope",
              diagnosis: "Essential hypertension, stage 2. No evidence of hypertensive emergency.",
              treatment: "Lisinopril 10mg daily in the morning. Sodium restriction under 2g/day. Walking 30 minutes 5 days per week. Baseline labs ordered: renal function panel and electrolytes.",
              possible_considerations: ["Rule out secondary hypertension given age of onset", "Monitor renal function on ACE inhibitor", "Screen for end-organ damage: fundoscopic exam, ECG", "Family history of stroke increases cardiovascular risk profile"],
              follow_up: "Return in 2 weeks for blood pressure recheck and medication tolerance assessment. Call immediately if facial/tongue swelling or persistent cough develops.",
              medications_mentioned: ["Lisinopril 10mg daily"],
            },
          },
          {
            transcript:
              "Doctor: Maria, welcome back. It's been two weeks since we started the Lisinopril. Tell me how things have been going. Patient: Well, the headaches are definitely better. I used to have them every single day and now it's maybe twice a week, and they're not as intense. The dizziness has improved too. But there's something new that's bothering me. Doctor: What's that? Patient: I've developed this dry cough. It started about a week after I began the medication. It's not like I'm sick, there's no mucus or anything. It's just this tickle in my throat that makes me cough, especially at night. It's actually waking me up sometimes. Doctor: I'm sorry to hear that, but unfortunately that's a well-known side effect of ACE inhibitors like Lisinopril. It happens in about 10 to 15 percent of patients. Let me check your blood pressure first. Alright, today you're at 148/90 on the left and 145/88 on the right. So we've come down from 168/96, which is good progress, but we're still above where I'd like you to be. Our target is under 130/80. Patient: Is it because the medication isn't working? Doctor: No, the medication is working. We can see the improvement. But the cough is a problem because it affects your quality of life and your sleep. Here's what I'd like to do. I'm going to switch you from Lisinopril to Losartan 50mg. Losartan is an ARB, which works through a similar pathway but very rarely causes a cough. You should notice the cough go away within a week or two after stopping the Lisinopril. Patient: What about my blood pressure, will the new medication work as well? Doctor: Losartan is very effective. We might need to adjust the dose once we see how you respond, but it should continue the progress we've made. How have the lifestyle changes been going? Patient: Pretty good actually. I've been walking every evening after dinner, about 30 to 40 minutes. My husband has been joining me which helps with motivation. And I've been cooking more at home and reading labels for sodium. It's harder than I thought, sodium is in everything. Doctor: You're doing great. The lifestyle changes are just as important as the medication. Your lab results from last visit looked good by the way. Kidney function is normal, electrolytes are fine. Let's follow up in three weeks to see how the Losartan is working and whether the cough has resolved. Keep up the walking and the low-sodium cooking. Patient: Thank you doctor. I'm glad the numbers are coming down at least.",
            ai_summary: {
              summary: "Two-week follow-up for newly diagnosed stage 2 hypertension. Blood pressure improved from 168/96 to 145/88 on Lisinopril 10mg but remains above target of 130/80. Headache frequency decreased from daily to twice weekly. Patient developed classic ACE inhibitor dry cough one week into therapy, causing sleep disruption. Previous labs showed normal renal function and electrolytes. Excellent adherence to lifestyle modifications including daily evening walks and sodium-conscious cooking. Switching to ARB to maintain antihypertensive effect without cough.",
              chief_complaint: "Follow-up hypertension management. New complaint of persistent dry cough disrupting sleep.",
              diagnosis: "Essential hypertension, partially controlled. ACE inhibitor-induced cough.",
              treatment: "Discontinue Lisinopril 10mg. Start Losartan 50mg daily. Continue low-sodium diet and daily walking program. No changes to lifestyle recommendations.",
              possible_considerations: ["Reassess blood pressure in 3 weeks on Losartan", "If not at target on Losartan 50mg, consider uptitration to 100mg or adding low-dose HCTZ", "Check electrolytes again after 4 weeks on ARB", "Cough should resolve within 1-2 weeks of stopping ACE inhibitor"],
              follow_up: "Follow-up in 3 weeks to assess Losartan response and confirm cough resolution.",
              medications_mentioned: ["Losartan 50mg daily"],
            },
          },
        ],
      },

      //carlos mendez - diabetes tipo 2
      {
        patientIndex: 1,
        consultations: [
          {
            transcript:
              "Doctor: Carlos, I have your lab results here and I'd like to go over them with you. Your fasting glucose came back at 210 milligrams per deciliter, and your hemoglobin A1c is 8.9 percent. To give you some context, a normal fasting glucose is under 100, and a normal A1c is under 5.7. An A1c of 8.9 tells us that your average blood sugar has been significantly elevated over the past two to three months. Patient: That doesn't sound good. Is that diabetes? Doctor: Yes Carlos, these results confirm a diagnosis of type 2 diabetes. Before we talk about treatment, tell me about the symptoms you've been experiencing. Patient: Well, for the past couple of months I've been feeling really tired. Not just regular tired, like bone-deep exhaustion even after a full night's sleep. And I'm constantly thirsty. I can drink a whole bottle of water and feel thirsty again in 20 minutes. The worst part is having to get up three or four times at night to use the bathroom. My wife is getting annoyed because it wakes her up too. Doctor: Those are all classic symptoms of uncontrolled diabetes. The high sugar in your blood is causing your kidneys to work overtime to filter it out, which pulls water along with it. That's why you're urinating frequently and feeling thirsty. The fatigue is because your cells aren't efficiently using glucose for energy. Tell me about your diet, what does a typical day look like? Patient: Breakfast is usually bread with butter and coffee with sugar. Lunch might be rice with some meat, maybe a soda. Dinner is similar, pasta or rice. I snack on crackers or cookies in the afternoon. And I probably drink two or three sodas a day. Doctor: And exercise? Patient: Not much honestly. I drive to work, sit at a desk all day, drive home. Maybe I walk to the corner store on weekends. Doctor: Alright Carlos, here's the plan. First, medication. I'm starting you on Metformin 500mg twice daily, taken with breakfast and dinner. This helps your body use insulin more effectively and reduces the amount of sugar your liver produces. Start with 500mg for the first week to let your stomach adjust, then go to 500mg twice daily. Common side effects are some nausea or stomach upset initially, but they usually pass. Patient: What about my diet? Doctor: We need significant changes there. I'm referring you to our nutritionist who specializes in diabetic meal planning. But immediately, I need you to eliminate sugary drinks completely. Switch to water, unsweetened tea, or sparkling water. The sodas alone could be adding 400 to 500 calories of pure sugar to your day. For meals, try to include more vegetables, lean proteins, and reduce the white rice and bread portions. Patient: And exercise? Doctor: Start with walking 30 minutes after your biggest meal of the day. Post-meal walking is one of the most effective things you can do to lower blood sugar. Even a 15-minute walk after eating can significantly reduce your glucose spike. We'll recheck your labs in 6 weeks to see how you're responding. Patient: Is diabetes something I'll have forever? Doctor: Type 2 diabetes is a chronic condition, but with good management many patients achieve excellent control. Some patients with significant lifestyle changes even achieve what we call remission, where their numbers return to normal range without medication. It takes commitment, but it's very possible.",
            ai_summary: {
              summary: "53-year-old male presenting with fatigue, polydipsia, and nocturia (3-4 times per night) for approximately 2 months. Labs confirm type 2 diabetes with fasting glucose 210 mg/dL and HbA1c 8.9%. Diet history reveals high carbohydrate intake with significant daily soda consumption (2-3 per day). Sedentary lifestyle with minimal physical activity. No current medications. BMI not recorded but dietary pattern suggests likely overweight. Initiating first-line oral therapy with comprehensive lifestyle intervention including dietary overhaul and structured exercise program.",
              chief_complaint: "Persistent fatigue, constant thirst, and nocturia 3-4 times per night for 2 months",
              diagnosis: "Type 2 diabetes mellitus, newly diagnosed, poorly controlled",
              treatment: "Metformin 500mg with breakfast for week 1, then 500mg BID with breakfast and dinner. Nutritionist referral for diabetic meal planning. Immediate elimination of all sugary beverages. Increase vegetable and lean protein intake, reduce refined carbohydrates. Post-meal walking 30 minutes daily starting with largest meal.",
              possible_considerations: ["Nephropathy screening with urine albumin-to-creatinine ratio", "Dilated retinal exam within first year of diagnosis", "Lipid panel to assess cardiovascular risk", "Consider adding second agent if HbA1c does not improve by at least 1% in 3 months", "Screen for depression which is common with new diabetes diagnosis", "Foot exam annually"],
              follow_up: "Recheck fasting glucose and HbA1c in 6 weeks. Nutritionist appointment to be scheduled within 2 weeks.",
              medications_mentioned: ["Metformin 500mg BID"],
            },
          },
          {
            transcript:
              "Doctor: Carlos, good to see you again. It's been 6 weeks since we started the Metformin. How are you doing? Patient: A lot better than I expected honestly. The first week was rough on my stomach. I had some nausea and had to run to the bathroom a couple of times. But after that it settled down and now I don't notice any side effects. Doctor: That's very common with Metformin. Glad your stomach adjusted. Tell me about the lifestyle changes. Patient: Well, the biggest thing is I completely stopped drinking soda. That was hard the first two weeks, I was craving it constantly. But my wife started buying sparkling water with a little lemon and that helped. I've also been eating more vegetables. We started cooking together on Sundays and prepping meals for the week. More chicken, fish, salads. Less rice and bread, though I still have some. Doctor: And the walking? Patient: That's actually become something I look forward to. I started walking after dinner and my wife joins me. We do about 30 to 40 minutes around the neighborhood. Some nights we talk about our day, some nights we just walk and listen to music. We've been doing it almost every night. Doctor: Carlos, that's wonderful. Those changes take real discipline. Let me share your lab results. Your fasting glucose has come down from 210 to 155, and your HbA1c has dropped from 8.9 to 7.8 percent. That's significant improvement in just 6 weeks. Patient: Is that good? Doctor: It's very good. We're moving in the right direction. The target HbA1c for most diabetic patients is under 7 percent, so we're not there yet, but the trajectory is excellent. Since you're tolerating the Metformin well, I'd like to increase your dose to 1000mg twice daily. This should help bring your numbers down further. Patient: Will the stomach issues come back? Doctor: They might for a day or two, but since you tolerated the lower dose well, most patients do fine with the increase. I also want to set up a few important screening tests. I'd like you to have a dilated eye exam. Diabetes can affect the blood vessels in the retina, and we want to catch any changes early. And I'm going to check your kidney function with a urine test. Patient: Okay. When do I come back? Doctor: Let's meet again in 8 weeks with fresh labs. Keep doing exactly what you're doing with the diet and exercise. You and your wife are building great habits.",
            ai_summary: {
              summary: "Six-week follow-up for newly diagnosed type 2 diabetes. Significant clinical improvement with combination of Metformin 500mg BID and lifestyle modifications. Fasting glucose decreased from 210 to 155 mg/dL, HbA1c from 8.9% to 7.8%. Patient experienced expected initial GI side effects from Metformin which resolved within one week. Remarkable lifestyle adherence: complete elimination of sugary beverages, improved diet with meal prepping, and consistent post-dinner walking program 30-40 minutes nightly with spouse. Tolerating medication well, advancing to full therapeutic dose. Initiating diabetic complication screening.",
              chief_complaint: "Follow-up diabetes management at 6 weeks",
              diagnosis: "Type 2 diabetes mellitus, improving with treatment. HbA1c trending toward target.",
              treatment: "Increase Metformin to 1000mg BID with meals. Continue current diet and exercise program. Schedule dilated eye exam for diabetic retinopathy screening. Order urine albumin-to-creatinine ratio for nephropathy screening.",
              possible_considerations: ["Monitor for GI side effects at higher Metformin dose", "Consider adding statin for cardiovascular risk reduction at next visit", "HbA1c recheck in 8 weeks to assess if reaching target of <7%", "If HbA1c plateaus above 7% consider adding second agent such as SGLT2 inhibitor"],
              follow_up: "Follow-up in 8 weeks with updated fasting glucose, HbA1c, lipid panel, and urine albumin-to-creatinine ratio",
              medications_mentioned: ["Metformin 1000mg BID"],
            },
          },
          {
            transcript:
              "Doctor: Carlos, welcome back. I have your latest lab results and I have to say, I'm really pleased with your progress. Your fasting glucose is 130 and your HbA1c has come down to 7.1 percent. You're knocking on the door of our target. Patient: That's great to hear. I feel like a different person honestly. I have more energy than I've had in years. I'm sleeping through the night without getting up to use the bathroom. My wife says I even look healthier. Doctor: You do look healthier. And I can see here you've lost about 5 kilos since your first visit. That weight loss alone improves insulin sensitivity significantly. Tell me what's changed. Patient: I stuck with everything we talked about. No more soda, I actually don't even miss it anymore. My wife and I still cook together on weekends and prep meals. The walking has become our thing, we do it every night rain or shine. Some days I even walk during my lunch break at work. Doctor: That's impressive consistency. I want to keep you on the current Metformin dose since it's working well. But I do want to address something new in your labs. Your LDL cholesterol is 145, which is elevated. For someone with diabetes, we like to see that under 100 because diabetes significantly increases cardiovascular risk. I'd like to start you on a low-dose statin, Atorvastatin 20mg, once daily at bedtime. Patient: Is the cholesterol related to the diabetes? Doctor: They're separate conditions but they often coexist, and together they multiply cardiovascular risk. The statin will help protect your heart and blood vessels. Think of it as a preventive measure. The most common side effects are mild muscle aches. If you notice any significant muscle pain or weakness, let me know right away. Patient: Okay. My father was on a statin too, actually. He's been fine with it. Doctor: That's reassuring. I also have your eye exam results back. Your retinal exam was normal, no signs of diabetic retinopathy. And your kidney function tests are all normal too. So your diabetes has not caused any organ damage, which is exactly what we want to see. Patient: That's a relief. How long will I need to take all this medication? Doctor: The Metformin and the statin are typically long-term medications. But with the lifestyle changes you've made, you're in the best possible position. Some patients who continue to lose weight and maintain their lifestyle can eventually reduce their Metformin dose. Let's not worry about that now. Continue what you're doing and I'll see you in 3 months. Patient: Thank you doctor. I have to say, when you first told me I had diabetes I was scared. But now I feel like I can manage this.",
            ai_summary: {
              summary: "Fourteen-week follow-up showing excellent response to combined pharmacological and lifestyle therapy for type 2 diabetes. HbA1c improved from 8.9% at diagnosis to 7.1%, approaching target of <7%. Fasting glucose now 130 mg/dL (down from 210). Weight loss of 5kg contributing to improved insulin sensitivity. All initial symptoms resolved: fatigue, polydipsia, and nocturia. Diabetic complication screening negative: retinal exam normal, renal function normal. New finding of elevated LDL cholesterol at 145 mg/dL requiring statin therapy for cardiovascular risk reduction in setting of diabetes. Patient demonstrates exceptional lifestyle adherence and positive psychological adjustment to diagnosis.",
              chief_complaint: "Follow-up diabetes management, routine labs review",
              diagnosis: "Type 2 diabetes mellitus, approaching glycemic target. Dyslipidemia with LDL 145 mg/dL. No diabetic complications detected.",
              treatment: "Continue Metformin 1000mg BID. Add Atorvastatin 20mg daily at bedtime for cardiovascular risk reduction. Maintain current diet and exercise program. No changes to lifestyle recommendations.",
              possible_considerations: ["Monitor liver function and CK if muscle symptoms develop on statin", "Consider low-dose aspirin for primary cardiovascular prevention", "If HbA1c reaches <7% on next check, continue current regimen and monitor", "Annual retinal exam and renal screening going forward", "Discuss possibility of Metformin dose reduction if weight loss continues and HbA1c remains at target"],
              follow_up: "Follow-up in 3 months with HbA1c, fasting glucose, lipid panel, and liver function tests",
              medications_mentioned: ["Metformin 1000mg BID", "Atorvastatin 20mg daily"],
            },
          },
        ],
      },

      //ana rodriguez - ansiedad
      {
        patientIndex: 2,
        consultations: [
          {
            transcript:
              "Doctor: Ana, good afternoon. What brings you in today? Patient: Hi doctor. I've been debating whether to come in or not, but things have gotten bad enough that I feel like I need help. For the past two months I've been feeling really anxious. Like all the time. My heart starts racing out of nowhere. I'll be sitting at my desk at work and suddenly my heart is pounding like I just ran up five flights of stairs. And I can't concentrate. I read the same email three times and still don't know what it says. Doctor: That sounds very distressing. Tell me more about the symptoms. Patient: At night is the worst. I lie in bed and my mind just won't shut off. I'm thinking about work, about everything that could go wrong, about things I said in meetings. It takes me one or two hours to fall asleep. And then I wake up at 4am with this knot in my stomach like something terrible is about to happen. But nothing is actually wrong. Does that make sense? Doctor: It makes perfect sense. How often does this happen? Patient: Every day. It's been every single day for at least two months. It's affecting everything. My work performance is slipping because I can't focus. I snapped at my partner last week over nothing and felt terrible about it. I used to go out with friends on weekends and now I just want to stay home. Doctor: Have you experienced anything like this before? Patient: I've always been a bit of a worrier, but never like this. This is different. This feels physical, not just mental. Doctor: Has anything significant changed in your life recently? Patient: I changed jobs about three months ago. It's a bigger company, more responsibility, more pressure. I feel like I'm constantly behind and everyone else knows what they're doing except me. My manager is nice but I'm terrified of making a mistake and getting fired. Doctor: I appreciate you sharing all of this, Ana. What you're describing is very consistent with generalized anxiety disorder. The persistent worry, the physical symptoms like the racing heart, the difficulty sleeping, the difficulty concentrating, all of these fit. Before we settle on a diagnosis though, I want to rule out any physical causes. Thyroid disorders can mimic anxiety almost exactly. Hyperthyroidism can cause rapid heart rate, insomnia, nervousness. I'm going to order a thyroid panel including TSH and free T4. Patient: Do you think it's my thyroid? Doctor: I think it's more likely anxiety, but I want to be thorough. While we wait for results, there are some things you can start doing now. First, breathing exercises. When you feel the anxiety rising, try breathing in for 4 counts, holding for 4, and exhaling for 6. Do this for two minutes. It activates your parasympathetic nervous system and can bring your heart rate down. Second, I'd like you to cut back on caffeine. How much coffee do you drink? Patient: Three or four cups a day. And usually an energy drink in the afternoon. Doctor: That's likely amplifying your symptoms significantly. Caffeine is a stimulant that directly triggers the same physiological responses as anxiety. Try cutting down to one cup in the morning only. No energy drinks. Patient: Should I be on medication? Doctor: Let's wait for the thyroid results first. If everything comes back normal, I may refer you to a psychologist for cognitive behavioral therapy, which is one of the most effective treatments for anxiety. We can also discuss medication at that point. Let's meet again in one week. Patient: Thank you doctor. It actually helps just to know there's a name for what I'm feeling.",
            ai_summary: {
              summary: "34-year-old female presenting with a 2-month history of pervasive anxiety symptoms occurring daily. Physical manifestations include unprovoked tachycardia, initial and middle insomnia (1-2 hours to fall asleep, 4am waking with somatic anxiety), and inability to concentrate. Psychological symptoms include persistent worry, catastrophic thinking, and sense of impending doom. Significant functional impairment reported across work performance, interpersonal relationships, and social activities. Patient describes herself as a lifelong worrier but current episode is qualitatively different with prominent physical symptoms. Onset correlates with a job change 3 months ago involving increased responsibility and perceived inadequacy. High caffeine intake (3-4 coffees plus afternoon energy drink) likely exacerbating symptoms. Ruling out hyperthyroidism as differential before confirming diagnosis and initiating treatment.",
              chief_complaint: "Two months of daily anxiety with racing heart, insomnia, poor concentration, and social withdrawal",
              diagnosis: "Generalized anxiety disorder, provisional. Pending thyroid workup to rule out hyperthyroidism.",
              treatment: "Thyroid panel ordered (TSH, free T4). Paced breathing technique introduced: 4-4-6 pattern for 2 minutes during acute anxiety. Caffeine reduction to one cup of coffee in the morning, eliminate energy drinks. Psychoeducation provided regarding GAD symptoms and treatment options.",
              possible_considerations: ["Hyperthyroidism as differential diagnosis", "Panic disorder if discrete panic episodes emerge", "Adjustment disorder with anxious mood given temporal relationship to job change", "Screen for comorbid depression at follow-up", "Assess relationship impact more thoroughly", "Consider referral to CBT-trained psychologist if thyroid normal"],
              follow_up: "Follow-up in 1 week to review thyroid results and reassess symptoms. Discuss CBT referral and possible pharmacotherapy if thyroid normal.",
              medications_mentioned: [],
            },
          },
          {
            transcript:
              "Doctor: Ana, welcome back. I have your thyroid results and I want to go over everything with you. Your TSH is 2.1 and your free T4 is 1.2, both completely within normal range. So we can confidently rule out a thyroid problem. This confirms that what you're experiencing is anxiety. Patient: Part of me was hoping it was the thyroid, because that seems more fixable. Doctor: I understand that feeling. But anxiety is very treatable too. Tell me how this past week has been. Patient: Honestly about the same. I tried the breathing exercises and they do help in the moment. Like when I feel my heart starting to race, if I do the breathing thing for a couple of minutes it slows down. But then an hour later it comes back. The caffeine reduction has been hard. I went down to two cups, I couldn't go to one right away. My sleep is still terrible. And something new happened. Doctor: Tell me about it. Patient: I had two episodes this week where it felt like a full-blown emergency. The first one was at work during a meeting. Suddenly my heart was pounding, my hands were tingling, I felt like I couldn't breathe, and I was convinced I was having a heart attack. I had to leave the room and sit in the bathroom for 15 minutes. The second one happened at home while I was watching TV on Sunday night. Same thing, completely out of nowhere. Heart racing, chest tight, sweating. My partner almost called an ambulance. Doctor: How long did these episodes last? Patient: The one at work was about 10 minutes. The one at home felt longer, maybe 15 or 20 minutes. And afterwards I felt completely exhausted, like I'd run a marathon. Doctor: Ana, what you're describing sounds like panic attacks. They're intense episodes of acute anxiety that come on suddenly and peak within minutes. The physical symptoms are very real and very frightening, but they're not dangerous. Your heart is healthy. The tingling in your hands is from hyperventilation. These are not heart attacks. Patient: It really felt like one. Doctor: I completely believe you. That's one of the most distressing things about panic attacks, they mimic cardiac events. Now, I want to talk about treatment. I'm going to do two things. First, I'm referring you to Dr. Fernandez, a psychologist who specializes in cognitive behavioral therapy for anxiety and panic. CBT is the gold standard psychological treatment. She'll help you identify thought patterns that feed the anxiety and give you concrete tools to manage it. Second, I'd like to start you on medication. Sertraline 25mg daily, which is a very low starting dose. Sertraline is an SSRI, a selective serotonin reuptake inhibitor. It helps regulate serotonin levels in the brain and is very effective for both generalized anxiety and panic attacks. Patient: How long until it works? Doctor: You may notice some initial effects in the first week, but the full therapeutic effect usually takes 2 to 3 weeks. During the first few days you might experience some mild nausea or a bit of restlessness. These usually pass within a week. If they're too uncomfortable, call us. Patient: I'm nervous about taking medication for my mental health. Doctor: That's a very common concern and I respect it. Think of it this way. Your brain has a chemical imbalance right now that's producing these symptoms. The medication helps correct that imbalance, just like blood pressure medication corrects blood pressure. There's no shame in it. We start at a low dose and we go slow. If at any point you want to stop, we'll do it gradually together. Patient: Okay. I trust you. When do I start? Doctor: You can start tomorrow morning with food. Take it at the same time every day. Let's follow up in 3 weeks. By then the Sertraline should be reaching its full effect and you'll have had your first session with Dr. Fernandez. If you have any concerns before then, don't hesitate to call. Patient: Thank you doctor. Having a plan makes me feel a little better already.",
            ai_summary: {
              summary: "One-week follow-up. Thyroid panel results normal (TSH 2.1, free T4 1.2), confirming anxiety as primary diagnosis. Patient reports minimal improvement with breathing exercises providing transient relief only. Caffeine reduced from 4+ cups to 2 cups daily. Sleep remains significantly impaired. New development: two distinct panic attack episodes this week. First episode during a work meeting with tachycardia, paresthesias in hands, dyspnea, and chest tightness lasting approximately 10 minutes. Second episode at home while watching TV with similar symptoms lasting 15-20 minutes, partner nearly called emergency services. Both episodes followed by significant post-episode fatigue. Panic attacks were spontaneous with no identifiable trigger. Diagnosis updated to include panic attacks. Initiating dual treatment approach with SSRI pharmacotherapy and CBT referral. Patient expressed initial reluctance about psychiatric medication but agreed to trial after psychoeducation about mechanism of action.",
              chief_complaint: "Ongoing daily anxiety with two new panic attack episodes this week. Insomnia persists.",
              diagnosis: "Generalized anxiety disorder with panic attacks. Thyroid dysfunction ruled out.",
              treatment: "Start Sertraline 25mg daily with food, same time each morning. Referral to Dr. Fernandez for cognitive behavioral therapy specializing in anxiety and panic. Continue breathing exercises. Continue caffeine reduction with goal of one cup daily.",
              possible_considerations: ["If Sertraline 25mg insufficient after 3-4 weeks, increase to 50mg", "Monitor for SSRI activation syndrome in first week", "If panic attacks increase in frequency, consider short-term benzodiazepine PRN while SSRI takes effect", "Screen for agoraphobic avoidance behavior developing secondary to panic attacks", "Reassess work-related stressors and consider workplace accommodations if needed"],
              follow_up: "Follow-up in 3 weeks to assess Sertraline response, panic attack frequency, and initial CBT progress. Call office if adverse effects or worsening symptoms occur before appointment.",
              medications_mentioned: ["Sertraline 25mg daily"],
            },
          },
        ],
      },

      //sofia herrera - migrana con aura
      {
        patientIndex: 3,
        consultations: [
          {
            transcript:
              "Doctor: Hi Sofia, what brings you in today? Patient: Hi doctor. I've been getting these really bad headaches for the last four months, and they're getting more frequent. Doctor: Can you describe them for me? Patient: They start on one side, usually the right side, right behind my eye. It's throbbing, like a pulse. And when it's really bad I can't stand light or noise, I just want to lie down in a dark room. Sometimes I feel nauseous too, once I actually threw up. Doctor: How long do they typically last? Patient: Anywhere from a few hours to almost a full day if I don't catch it early. Doctor: How often are you getting them? Patient: When it started it was maybe once a month. The last few weeks it's been more like twice a week. It's affecting my work, I had to leave a client meeting last week because the light in the conference room was unbearable. Doctor: Do you notice anything before the headache starts, any warning signs? Patient: Sometimes I see these zigzag lines in my vision for about 15 minutes before the pain starts. It's strange, like a shimmering line off to one side. Doctor: That's called an aura, it's actually a classic feature of migraine with aura. Have you noticed any triggers? Patient: Stress for sure, work has been intense lately. And I think when I don't sleep enough, like under 6 hours, I'm more likely to get one. Also maybe around my period, though I haven't tracked it carefully. Doctor: Any family history of migraines? Patient: Yes, actually, my mother gets migraines too. Doctor: That's very relevant, migraines have a strong genetic component. What have you been taking for the pain? Patient: Just ibuprofen, but honestly it barely touches it once it's bad. Doctor: That's common, over the counter NSAIDs often aren't enough once a migraine is established. Based on everything you've described, the one-sided throbbing pain, light and sound sensitivity, nausea, and the visual aura beforehand, this is a clear presentation of migraine with aura. Given how frequently they're happening now, twice a week, I want to start you on two things. First, for acute attacks, I'm prescribing Sumatriptan 50mg. Take it as soon as you notice the headache starting, ideally during the aura or right when the pain begins. Don't wait until it's severe. Patient: And for the frequency? Doctor: Since you're having more than 4 headache days a month, you qualify for preventive treatment. I'm starting you on Propranolol 40mg twice daily. It's a beta blocker that's been shown to reduce migraine frequency significantly over time. It can take 4 to 6 weeks to see the full effect, so don't get discouraged if the first couple weeks don't show much change. Patient: Are there side effects I should watch for? Doctor: Propranolol can cause some fatigue or lightheadedness initially, and since it lowers heart rate, avoid stopping it abruptly. I also want you to start a headache diary, note the date, what you were doing, how long it lasted, and anything you ate or how much you slept the night before. That'll help us identify your specific triggers. Patient: Okay, I can do that. Doctor: Let's follow up in 6 weeks to see how the Propranolol is working and review your diary. Patient: Thank you doctor, it's a relief to have a plan.",
            ai_summary: {
              summary: "29-year-old female presenting with a 4-month history of migraine with aura, increasing in frequency from monthly to twice weekly. Headaches are unilateral, throbbing, associated with photophobia, phonophobia, and nausea with one episode of vomiting. Visual aura (zigzag scintillations) precedes attacks by approximately 15 minutes. Triggers identified include stress, sleep deprivation under 6 hours, and possible menstrual correlation. Positive family history (mother with migraines). Over-the-counter ibuprofen providing inadequate relief. Meets criteria for preventive therapy given attack frequency exceeding 4 days per month. Starting abortive and prophylactic treatment with headache diary for trigger identification.",
              chief_complaint: "Recurrent unilateral throbbing headaches with visual aura, increasing in frequency over 4 months",
              diagnosis: "Migraine with aura, high frequency (twice weekly)",
              treatment: "Sumatriptan 50mg as needed at onset of attack or during aura. Propranolol 40mg twice daily for prevention. Headache diary to track frequency, duration, and potential triggers.",
              possible_considerations: ["Rule out secondary causes if red flags develop (sudden severe onset, neurological deficits, fever)", "Reassess need for prophylaxis effectiveness at 6 weeks", "Consider hormonal correlation given possible menstrual pattern", "Screen for medication overuse headache if triptan use exceeds 10 days per month"],
              follow_up: "Follow-up in 6 weeks to assess Propranolol response and review headache diary.",
              medications_mentioned: ["Sumatriptan 50mg PRN", "Propranolol 40mg BID"],
            },
          },
          {
            transcript:
              "Doctor: Sofia, welcome back. It's been 6 weeks since we started the Propranolol. How have things been? Patient: Better, honestly a lot better than I expected. Looking at my diary, I only had 3 migraines in the last month, down from about 8 the month before I started treatment. Doctor: That's a great response. Tell me about the ones you did have. Patient: They were shorter too. Maybe 3 or 4 hours instead of a full day. I took the Sumatriptan right when I noticed the zigzag lines starting and it really helped, the pain never got as intense as before. Doctor: That's exactly how it should work, catching it early during the aura gives the medication time to work before the pain peaks. Any side effects from the Propranolol? Patient: The first week I felt a bit tired and my resting heart rate seemed lower, I noticed it on my fitness watch. But that went away after about 10 days. Doctor: That's typical, your body adjusts to the beta blocker. What does your diary show about triggers? Patient: It's pretty clear actually, all three migraines happened on weeks where I slept less than 6 hours at least twice. And one of them was the week before my period. Doctor: That confirms what we suspected, sleep deprivation and hormonal fluctuation are your main triggers. I'd like you to keep prioritizing sleep, especially during the week before your period when you might be more vulnerable. Patient: Should I keep taking the Propranolol? Doctor: Yes, I want to continue at the same dose since you're responding so well. We're not going to change anything that's working. Let's keep the headache diary going, it's clearly helping us understand your pattern. Patient: This is honestly the best my head has felt in months. Doctor: I'm really glad to hear that. Let's follow up again in 3 months, and continue using the Sumatriptan as needed for any breakthrough attacks.",
            ai_summary: {
              summary: "Six-week follow-up for migraine with aura on prophylactic Propranolol 40mg BID. Excellent treatment response: migraine frequency reduced from approximately 8 per month to 3 per month, with reduced duration (3-4 hours vs full day previously) and reduced intensity when using Sumatriptan early during the aura phase. Initial mild fatigue and reduced resting heart rate from Propranolol resolved after 10 days. Headache diary confirms sleep deprivation (under 6 hours) and premenstrual timing as primary triggers. Patient demonstrates good self-management with early abortive treatment during aura onset. Continuing current regimen given strong response.",
              chief_complaint: "Follow-up migraine management at 6 weeks",
              diagnosis: "Migraine with aura, significantly improved on prophylaxis",
              treatment: "Continue Propranolol 40mg BID. Continue Sumatriptan 50mg PRN at aura onset. Continue headache diary. Reinforce sleep hygiene, particularly during premenstrual week.",
              possible_considerations: ["Reassess in 3 months for continued response", "If frequency continues to decline, consider discussing prophylaxis taper after 6-12 months of stability", "Monitor heart rate periodically while on beta blocker", "Consider tracking menstrual cycle alongside headache diary to confirm hormonal pattern"],
              follow_up: "Follow-up in 3 months. Continue Sumatriptan as needed for breakthrough migraines.",
              medications_mentioned: ["Propranolol 40mg BID", "Sumatriptan 50mg PRN"],
            },
          },
        ],
      },

      //jorge ramirez - distension lumbar aguda, se resuelve
      {
        patientIndex: 4,
        consultations: [
          {
            transcript:
              "Doctor: Jorge, what happened? Patient: I was helping my brother move a couch on Saturday and I felt this sharp pain in my lower back when I bent down to lift it. I heard myself say something wasn't right immediately. Doctor: On a scale of 1 to 10, how would you rate the pain right now? Patient: Sitting here it's maybe a 5. But if I bend forward or try to stand up from sitting, it jumps to an 8, sometimes 9. Doctor: Where exactly is the pain located? Patient: Right here, lower back, both sides but more on the left. It doesn't really go down my leg or anything, it stays in my back. Doctor: That's good to know, pain that doesn't radiate down the leg is less concerning for nerve involvement. Any numbness, tingling, or weakness in your legs? Patient: No, nothing like that. Doctor: Any problems with bladder or bowel control since the injury? Patient: No, everything's normal there. Doctor: That's reassuring, those would be red flag symptoms we'd need to address urgently. Let me examine your back. Can you point to exactly where it hurts most? Patient: Right along here, on both sides of my spine, lower down. Doctor: I'm going to press on a few areas and move your legs, let me know if anything reproduces the pain. Okay, your straight leg raise test is negative on both sides, which is reassuring, that helps rule out a disc problem pressing on a nerve. I do feel significant muscle tightness and spasm along the paraspinal muscles on both sides, worse on the left, consistent with what you're describing. Your reflexes and strength in both legs are completely normal. Patient: So it's not serious? Doctor: Based on the story and the exam, this looks like an acute lumbar muscle strain from the lifting injury. There's no evidence of nerve compression or disc herniation, which is good news. Patient: That's a relief, I was worried I did something to a disc. Doctor: The absence of leg pain, numbness, or a positive straight leg raise test are all reassuring signs. For treatment, I want you to avoid bed rest, that actually delays recovery. Staying as active as your pain allows is better for healing. Avoid heavy lifting or bending for now. I'm prescribing Naproxen 500mg twice daily with food for the inflammation, and Cyclobenzaprine 5mg at bedtime for the muscle spasm, that one can make you drowsy so only take it at night. Patient: Any home remedies that help? Doctor: Ice for the first 48 hours, 15 to 20 minutes at a time, then you can switch to heat after that, it helps relax the muscles. Patient: Should I see a physical therapist? Doctor: Yes, I'm referring you to physical therapy. They'll show you gentle stretches and core strengthening exercises once the acute pain settles a bit. Let's see how you're doing in 2 weeks.",
            ai_summary: {
              summary: "42-year-old male presenting with acute onset lower back pain following a lifting injury while moving furniture two days ago. Pain rated 5/10 at rest, increasing to 8-9/10 with forward flexion or transitioning from sitting to standing. Bilateral lower back pain, left greater than right, without radiation to the legs. No numbness, tingling, weakness, or bowel/bladder dysfunction. Physical exam notable for bilateral paraspinal muscle spasm, worse on the left, with negative straight leg raise bilaterally and fully intact strength and reflexes. Clinical picture consistent with acute lumbar muscle strain without evidence of disc herniation or nerve root involvement. Conservative management initiated with anti-inflammatory and muscle relaxant, activity modification, and physical therapy referral.",
              chief_complaint: "Acute lower back pain following a lifting injury 2 days ago",
              diagnosis: "Acute lumbar muscle strain, no evidence of disc herniation or radiculopathy",
              treatment: "Naproxen 500mg twice daily with food. Cyclobenzaprine 5mg at bedtime for muscle spasm. Ice for the first 48 hours, then heat. Avoid heavy lifting and bending. Stay active within pain tolerance, avoid bed rest. Physical therapy referral for stretching and core strengthening.",
              possible_considerations: ["MRI if no improvement within 4-6 weeks or if red flag symptoms develop", "Reassess for radicular symptoms at follow-up", "Cyclobenzaprine causes drowsiness, advise caution with driving", "Negative straight leg raise and absence of neurological deficits are reassuring against disc herniation"],
              follow_up: "Follow-up in 2 weeks to assess pain improvement and physical therapy progress.",
              medications_mentioned: ["Naproxen 500mg BID", "Cyclobenzaprine 5mg at bedtime"],
            },
          },
          {
            transcript:
              "Doctor: Jorge, good to see you. It's been 2 weeks, how's the back doing? Patient: Much better actually. I'd say the pain is down to maybe a 1 or 2, and only if I move a certain way first thing in the morning. Most of the day I don't really notice it anymore. Doctor: That's excellent progress. Are you still taking the Naproxen and Cyclobenzaprine? Patient: I stopped the Cyclobenzaprine after about 5 days, I didn't need it for the spasms anymore and it was making me groggy in the mornings. I'm still taking the Naproxen occasionally, maybe once a day, mostly if I've been sitting a lot at my desk. Doctor: That's fine, you can taper off the Naproxen as needed now, you don't need it on a fixed schedule anymore. How did physical therapy go? Patient: I went to 4 sessions. The therapist gave me some core exercises and stretches, and honestly they've helped a lot. I've been doing them at home every morning. Doctor: That's great, building that core strength will help prevent this from happening again. Let me examine you again. Range of motion looks good, you can bend forward almost fully without pain. Paraspinal muscles feel relaxed now, no spasm like last time. Straight leg raise is still negative, reflexes and strength are normal. Patient: So am I good to go back to normal activity? Doctor: Yes, I think you've recovered well from the muscle strain. You can return to your normal activities, including lifting, but I want you to use proper lifting technique going forward, bend at the knees, keep the object close to your body, and avoid twisting while lifting. Patient: I definitely learned that lesson the hard way. Doctor: Continue the core exercises from physical therapy a few times a week even now that you're feeling better, that's what will keep this from recurring. You can stop the Naproxen entirely at this point since your pain is minimal. Patient: Do I need to come back for anything else? Doctor: Not for this issue, you've fully recovered from the lumbar strain. If you have another episode of back pain in the future or if anything changes, feel free to come back in. Patient: Thank you doctor, I really appreciate how thorough you were from the start.",
            ai_summary: {
              summary: "Two-week follow-up for acute lumbar muscle strain sustained during a lifting injury. Complete clinical resolution: pain improved from 8-9/10 at presentation to 1-2/10, occurring only with certain morning movements. Discontinued Cyclobenzaprine after 5 days once spasms resolved; tapering Naproxen as needed. Completed 4 physical therapy sessions with core strengthening and stretching exercises, performed consistently at home with good effect. Exam shows full pain-free range of motion, resolved paraspinal spasm, and persistently negative straight leg raise with normal strength and reflexes. Patient cleared to resume normal activity including lifting, with counseling on proper lifting mechanics to prevent recurrence. This was a self-limited acute musculoskeletal injury with full recovery, not a chronic condition.",
              chief_complaint: "Follow-up for lumbar strain, near-complete symptom resolution",
              diagnosis: "Resolved acute lumbar muscle strain",
              treatment: "Discontinue Naproxen. Continue core strengthening and stretching exercises learned in physical therapy 2-3 times per week. Counseled on proper lifting technique: bend at knees, keep load close to body, avoid twisting while lifting.",
              possible_considerations: ["No further imaging or referral needed given full clinical recovery", "Educate on lifting mechanics to reduce recurrence risk", "Return if symptoms recur or new radicular symptoms develop"],
              follow_up: "No scheduled follow-up needed for this issue. Return as needed if back pain recurs.",
              medications_mentioned: [],
            },
          },
        ],
      },
    ];

    //insertar consultas
    for (const patientData of consultationData) {
      const patientId = patientIds[patientData.patientIndex];

      for (const consultation of patientData.consultations) {
        await conexionDB.execute(
          `INSERT INTO consultations (patient_id, doctor_id, transcript, ai_summary, status)
           VALUES (?, ?, ?, ?, ?)`,
          [
            patientId,
            doctorId,
            consultation.transcript,
            JSON.stringify(consultation.ai_summary),
            "signed",
          ]
        );
      }
    }

    logger.info("11 consultas demo creadas");

    //crear patient memory para cada paciente
    const memories = [
      {
        patientIndex: 0,
        chronic_diseases: ["Essential hypertension"],
        allergies: ["Penicillin"],
        medications: ["Losartan 50mg daily"],
        recurrent_symptoms: ["Morning headaches", "Positional dizziness"],
        master_summary:
          "39-year-old female with stage 2 hypertension diagnosed 6 weeks ago. Initially started on Lisinopril 10mg but developed ACE inhibitor cough after one week, switched to Losartan 50mg. Blood pressure improving from 168/96 at diagnosis to 145/88 at last visit but not yet at target of 130/80. Family history significant for paternal hypertension and stroke at age 60. Baseline labs showed normal renal function and electrolytes. Good compliance with lifestyle modifications including low-sodium diet and daily evening walks with husband. Pending follow-up to assess Losartan response and determine if dose adjustment or second agent needed.",
      },
      {
        patientIndex: 1,
        chronic_diseases: ["Type 2 diabetes mellitus", "Dyslipidemia"],
        allergies: ["Penicillin", "Sulfa drugs"],
        medications: ["Metformin 1000mg BID", "Atorvastatin 20mg daily"],
        recurrent_symptoms: ["Fatigue (resolved)", "Polydipsia (resolved)", "Nocturia (resolved)"],
        master_summary:
          "53-year-old male with type 2 diabetes diagnosed 4 months ago. Excellent response to combined pharmacological and lifestyle therapy. HbA1c improved from 8.9% at diagnosis to 7.1%, approaching target of <7%. Fasting glucose improved from 210 to 130 mg/dL. All presenting symptoms resolved. Weight loss of 5kg through dietary changes and consistent exercise. Diabetic complication screening negative: retinal exam normal, renal function normal. Recently started Atorvastatin 20mg for LDL of 145 mg/dL for cardiovascular risk reduction. Currently on Metformin 1000mg BID, well tolerated. Exceptional lifestyle adherence: eliminated sugary beverages, weekly meal prepping with wife, daily post-dinner walks. Family history of statin use (father). Next milestone: HbA1c under 7%.",
      },
      {
        patientIndex: 2,
        chronic_diseases: ["Generalized anxiety disorder"],
        allergies: ["Latex"],
        medications: ["Sertraline 25mg daily"],
        recurrent_symptoms: ["Anxiety episodes", "Panic attacks", "Insomnia", "Tachycardia"],
        master_summary:
          "34-year-old female with generalized anxiety disorder and panic attacks. Symptom onset approximately 2 months ago correlating temporally with a job change to a more demanding role 3 months ago. Self-described lifelong worrier but current episode qualitatively different with prominent physical symptoms. Thyroid workup negative (TSH 2.1, free T4 1.2). Two documented panic attacks: one at work during a meeting, one at home at rest. Breathing exercises provide transient symptom relief. High caffeine intake being reduced (from 4+ cups to 2 cups daily). Started on Sertraline 25mg with referral to Dr. Fernandez for CBT. Significant functional impairment across work, relationships, and social activities. Pending 3-week follow-up to assess SSRI response and initial CBT progress.",
      },
      {
        patientIndex: 3,
        chronic_diseases: ["Migraine with aura"],
        allergies: ["Aspirin"],
        medications: ["Propranolol 40mg BID", "Sumatriptan 50mg PRN"],
        recurrent_symptoms: ["Unilateral throbbing headaches", "Visual aura", "Photophobia", "Nausea"],
        master_summary:
          "29-year-old female with migraine with aura, significantly improved on Propranolol 40mg BID prophylaxis. Frequency reduced from roughly 8 episodes per month at diagnosis to 3 per month after 6 weeks of treatment, with shorter duration and lower intensity when Sumatriptan 50mg is taken early during the aura phase. Primary triggers identified through headache diary: sleep deprivation under 6 hours and premenstrual timing. Positive family history of migraine (mother). Tolerating Propranolol well after initial mild fatigue resolved. No red flag features. Continuing current prophylactic and abortive regimen given strong response.",
      },
      {
        patientIndex: 4,
        chronic_diseases: [],
        allergies: [],
        medications: [],
        recurrent_symptoms: [],
        master_summary:
          "42-year-old male with a fully resolved episode of acute lumbar muscle strain sustained while lifting furniture. Presented with bilateral lower back pain and muscle spasm without radicular features, neurological deficits, or red flag symptoms. Treated conservatively with NSAIDs, a short course of muscle relaxant, and physical therapy, with full resolution of pain and function within 2 weeks. No chronic musculoskeletal condition identified. No known drug allergies. Not currently on any medications. Counseled on proper lifting mechanics to reduce risk of recurrence.",
      },
    ];

    for (const memory of memories) {
      const patientId = patientIds[memory.patientIndex];

      await conexionDB.execute(
        `INSERT INTO patient_memory (patient_id, chronic_diseases, allergies, medications, recurrent_symptoms, master_summary)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          patientId,
          JSON.stringify(memory.chronic_diseases),
          JSON.stringify(memory.allergies),
          JSON.stringify(memory.medications),
          JSON.stringify(memory.recurrent_symptoms),
          memory.master_summary,
        ]
      );
    }

    logger.info("5 patient memories creadas");

    logger.info({
      doctorId,
      patients: patientIds.length,
      consultations: 11,
      memories: 5,
    }, "demo seed completado - correr seedIndexing.ts para chunks + embeddings");

  } catch (error) {
    logger.error(error, "error en demo seed");
  } finally {
    process.exit(0);
  }
}

seedDemo();