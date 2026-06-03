

CREATE TABLE doctors ( 

  id            INT AUTO_INCREMENT PRIMARY KEY, 

  name          VARCHAR(120) NOT NULL, 

  email         VARCHAR(120) UNIQUE NOT NULL, 

  password_hash VARCHAR(255) NOT NULL, 

  specialty     VARCHAR(100), 

  role          ENUM('doctor','admin') DEFAULT 'doctor', 

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

  INDEX idx_email (email) 

); 


CREATE TABLE patients ( 

  id           INT AUTO_INCREMENT PRIMARY KEY, 

  doctor_id    INT NOT NULL, 

  name         VARCHAR(120) NOT NULL, 

  birth_date   DATE, 

  gender       ENUM('M','F','X','U') DEFAULT 'U', 

  national_id  VARCHAR(30),          

  phone        VARCHAR(30), 

  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 

  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE, 

  INDEX idx_doctor (doctor_id), 

  INDEX idx_national_id (national_id) 

);


CREATE TABLE consultations ( 

  id              INT AUTO_INCREMENT PRIMARY KEY, 

  patient_id      INT NOT NULL, 

  doctor_id       INT NOT NULL, 

  transcript      MEDIUMTEXT, 

  ai_summary      JSON,           

  edited_summary  JSON,            

  audio_url       VARCHAR(500),    

  duration_sec    INT, 

  status          ENUM('draft','reviewed','signed') DEFAULT 'draft', 

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

  signed_at       TIMESTAMP NULL, 

  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE, 

  FOREIGN KEY (doctor_id)  REFERENCES doctors(id), 

  INDEX idx_patient_created (patient_id, created_at DESC), 

  FULLTEXT idx_transcript (transcript) 

); 


CREATE TABLE patient_memory ( 

  patient_id        INT PRIMARY KEY, 

  chronic_diseases  JSON,   

  allergies         JSON,   

  medications       JSON,   

  recurrent_symptoms JSON,   

  master_summary    TEXT,   

  last_updated      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 

  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE 

); 


CREATE TABLE consultation_chunks ( 

  id              INT AUTO_INCREMENT PRIMARY KEY, 

  patient_id      INT NOT NULL, 

  consultation_id INT NOT NULL, 

  chunk_index     INT NOT NULL, 

  text            TEXT NOT NULL, 

  embedding       JSON NOT NULL,    

  tokens          INT, 

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

  FOREIGN KEY (patient_id)      REFERENCES patients(id)      ON DELETE CASCADE, 

  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE, 

  INDEX idx_patient (patient_id), 

  FULLTEXT idx_text (text) 

); 


CREATE TABLE ai_logs ( 

  id              INT AUTO_INCREMENT PRIMARY KEY, 

  doctor_id       INT, 

  consultation_id INT, 

  provider        ENUM('whisper','groq','gemini','claude','gpt'), 

  operation       VARCHAR(50),     

  model           VARCHAR(80), 

  prompt_tokens   INT, 

  output_tokens   INT, 

  latency_ms      INT, 

  status          ENUM('ok','retry','error'), 

  error_msg       TEXT, 

  cost_usd        DECIMAL(10,6), 

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

  INDEX idx_status_date (status, created_at), 

  INDEX idx_doctor_date (doctor_id, created_at) 

); 


CREATE TABLE audit_log ( 

  id          BIGINT AUTO_INCREMENT PRIMARY KEY, 

  actor_id    INT,                   

  action      VARCHAR(80) NOT NULL, 

  entity      VARCHAR(40), 

  entity_id   INT, 

  ip          VARCHAR(45), 

  user_agent  VARCHAR(255), 

  meta        JSON, 

  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

  INDEX idx_actor_date (actor_id, created_at), 

  INDEX idx_entity (entity, entity_id) 

); 

CREATE TABLE chat_sessions ( 

  id          VARCHAR(36) PRIMARY KEY,  

  doctor_id   INT NOT NULL, 

  context     JSON, 

  history     JSON,                     

  expires_at  TIMESTAMP NOT NULL, 

  INDEX idx_expires (expires_at) 

); 

