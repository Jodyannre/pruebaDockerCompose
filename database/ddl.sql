
CREATE TABLE LOG (
	id_log INT AUTO_INCREMENT PRIMARY KEY,
	metodo VARCHAR(50),
    entrada JSON,
    salida JSON,
    esError TINYINT,
    fecha DATETIME,
    hora TIME
)
;

CREATE TABLE RAZA (
	id_raza INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

#ESTADO CITA
CREATE TABLE E_CI(
	id_e_ci INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

#ESTADO DESCUENTO
CREATE TABLE E_DE(
	id_e_de INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;


#ESTADO MOTIVO
CREATE TABLE E_MO(
	id_e_mo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

#ESTADO PAGO
CREATE TABLE E_PA(
	id_e_pa INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

#TIPO PAGO
CREATE TABLE T_PA(
	id_t_pa INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;


CREATE TABLE MONEDA(
	id_moneda INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

CREATE TABLE MEDICAMENTO(
	id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

CREATE TABLE SALA(
	id_sala INT AUTO_INCREMENT,
    nombre VARCHAR(100),
    PRIMARY KEY (id_sala)
)
;

CREATE TABLE MOTIVO(
	id_motivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio NUMERIC(6,2),
    tiempo INT
)
;
/*
ALTER TABLE MOTIVO
ADD PRIMARY KEY(id_motivo)
;
*/


#TIPO CITA
CREATE TABLE T_CI(
	id_t_ci INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

CREATE TABLE ESPECIALIDAD(
	id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

#TIPO CLIENTE
CREATE TABLE T_CL(
	id_t_cl INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

#HORARIO
CREATE TABLE HORARIO(
	id_horario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    inicio TIME,
    fin TIME
)
;

#Agregar en base de datos en la nube
/*
ALTER TABLE HORARIO 
ADD COLUMN inicio TIME
AFTER nombre;

ALTER TABLE HORARIO
ADD COLUMN fin TIME
AFTER inicio;
*/

CREATE TABLE DIA(
	id_dia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

#ESTADO USUARIO
CREATE TABLE E_US(
	id_e_us INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;


#TIPO USUARIO

CREATE TABLE T_US(
	id_t_us INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
)
;

CREATE TABLE PERSONA(
	id_persona INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    edad INT,
    direccion VARCHAR(200),
    telefono VARCHAR(20)
)
;


#-----------------------------------SEGUNDO NIVEL---------------------------

CREATE TABLE DESCUENTO(
	id_descuento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    cantidad NUMERIC(8,2),
    id_e_de INT,
    CONSTRAINT e_de_de_fk FOREIGN KEY(id_e_de)
    REFERENCES E_DE(id_e_de)
)
;
#Agregar a la base de GCP----------------------------------------------
#ALTER TABLE DESCUENTO MODIFY cantidad NUMERIC(8,2);

CREATE TABLE CLIENTE(
	id_persona INT,
    id_t_cl INT,
    PRIMARY KEY(id_persona),
    CONSTRAINT per_cl_fk FOREIGN KEY (id_persona)
    REFERENCES PERSONA(id_persona)
    ON DELETE CASCADE,
    CONSTRAINT t_cl_cl_fk FOREIGN KEY (id_t_cl)
    REFERENCES T_CL(id_t_cl)
    ON DELETE CASCADE
)
;

CREATE TABLE MEDICO(
	id_persona INT,
    id_especialidad INT,
    PRIMARY KEY (id_persona),
    CONSTRAINT per_med_fk FOREIGN KEY (id_persona)
    REFERENCES PERSONA(id_persona)
    ON DELETE CASCADE,
    CONSTRAINT esp_med_fk FOREIGN KEY (id_especialidad)
	REFERENCES ESPECIALIDAD(id_especialidad)
    ON DELETE CASCADE
)
;

CREATE TABLE H_L (
	id_h_l INT AUTO_INCREMENT PRIMARY KEY,
    id_dia INT,
    id_horario INT,
    id_persona INT
)
;

ALTER TABLE H_L
ADD CONSTRAINT dia_h_l_fk
FOREIGN KEY (id_dia)
REFERENCES DIA(id_dia)
ON DELETE CASCADE
;

ALTER TABLE H_L
ADD CONSTRAINT horario_h_l_fk
FOREIGN KEY (id_horario)
REFERENCES HORARIO(id_horario)
ON DELETE CASCADE
;

ALTER TABLE H_L
ADD CONSTRAINT per_h_l_fk
FOREIGN KEY (id_persona)
REFERENCES PERSONA(id_persona)
ON DELETE CASCADE
;



CREATE TABLE USUARIO (
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100),
    pass VARCHAR(256),
    id_persona	INT,
    id_e_us	INT,
    id_t_us	INT,
    CONSTRAINT per_us_fk FOREIGN KEY (id_persona)
    REFERENCES PERSONA(id_persona)
    ON DELETE CASCADE,
    CONSTRAINT e_us_us FOREIGN KEY (id_e_us)
    REFERENCES E_US(id_e_us)
    ON DELETE CASCADE,    
	CONSTRAINT t_us_us FOREIGN KEY (id_t_us)
    REFERENCES T_US(id_t_us)
    ON DELETE CASCADE
)
;

CREATE TABLE MASCOTA (
	id_mascota	INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    edad INT,
    foto VARCHAR(200),
    genero INT,
	id_raza INT,
    CONSTRAINT raza_mas_fk FOREIGN KEY (id_raza)
    REFERENCES RAZA(id_raza)
	ON DELETE CASCADE
)
;

#-----------------------------TERCER NIVEL---------------------------------

CREATE TABLE ESTUDIO (
	id_estudio INT AUTO_INCREMENT PRIMARY KEY,
    direccion VARCHAR(200),
    nombre VARCHAR(100),
    id_mascota INT,
    CONSTRAINT mas_est_fk FOREIGN KEY (id_mascota)
    REFERENCES MASCOTA(id_mascota)
    ON DELETE CASCADE
)
;

CREATE TABLE MA_D (
	id_usuario INT,
    id_mascota INT,
    PRIMARY KEY(id_usuario,id_mascota)
)
;

ALTER TABLE MA_D
ADD CONSTRAINT us_ma_D_fk
FOREIGN KEY (id_usuario)
REFERENCES USUARIO(id_usuario)
ON DELETE CASCADE
;

ALTER TABLE MA_D
ADD CONSTRAINT ma_ma_D_fk
FOREIGN KEY (id_mascota)
REFERENCES MASCOTA(id_mascota)
ON DELETE CASCADE
;

CREATE TABLE CITA (
	id_cita INT AUTO_INCREMENT PRIMARY KEY,
    #hora_inicio TIME,
    #hora_fin TIME,
    fecha DATE,
    costo NUMERIC(8,2),
    id_mascota INT,
    id_descuento INT,
    id_e_ci INT,
    id_t_ci INT,
    CONSTRAINT mas_cita_fk FOREIGN KEY (id_mascota)
    REFERENCES MASCOTA(id_mascota)
    ON DELETE CASCADE,
    CONSTRAINT desc_cita_fk FOREIGN KEY (id_descuento)
    REFERENCES DESCUENTO(id_descuento)
    ON DELETE CASCADE,
    CONSTRAINT e_ci_cita_fk FOREIGN KEY (id_e_ci)
    REFERENCES E_CI(id_e_ci)
    ON DELETE CASCADE,
    CONSTRAINT t_ci_cita_fk FOREIGN KEY (id_t_ci)
    REFERENCES T_CI(id_t_ci)
    ON DELETE CASCADE
)
;
#-------------------------SIGUIENTE NIVEL---------------------------
CREATE TABLE PAGO (
	id_pago INT AUTO_INCREMENT PRIMARY KEY,
    total NUMERIC(8,2),
    id_cita INT,
    id_e_pa INT,
    id_t_pa INT,
    id_moneda INT,
    CONSTRAINT ci_pa_fk FOREIGN KEY (id_cita)
    REFERENCES CITA(id_cita)
    ON DELETE CASCADE,
    CONSTRAINT e_pa_pa_fk FOREIGN KEY (id_e_pa)
    REFERENCES E_PA(id_e_pa)
    ON DELETE CASCADE,
    CONSTRAINT t_pa_pa_fk FOREIGN KEY (id_t_pa)
    REFERENCES T_PA(id_t_pa)
    ON DELETE CASCADE,
    CONSTRAINT mon_pa_fk FOREIGN KEY (id_moneda)
    REFERENCES MONEDA(id_moneda)
    ON DELETE CASCADE
)
;


CREATE TABLE RECETA(
	id_receta INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT,
    CONSTRAINT ci_re_fk FOREIGN KEY (id_cita)
    REFERENCES CITA(id_cita)
    ON DELETE CASCADE    
)
;


CREATE TABLE D_MO (
	id_d_mo INT AUTO_INCREMENT PRIMARY KEY,
    costo NUMERIC(8,2),
    hora_inicio TIME,
    hora_fin TIME,
    id_motivo INT,
    id_sala INT,
    id_cita INT,
    id_persona INT,
    id_e_mo INT,
    CONSTRAINT mo_d_mo_fk FOREIGN KEY (id_motivo)
    REFERENCES MOTIVO(id_motivo)
    ON DELETE CASCADE,
    CONSTRAINT sa_d_mo_fk FOREIGN KEY (id_sala)
    REFERENCES SALA(id_sala)
    ON DELETE CASCADE,
    CONSTRAINT per_d_mo_fk FOREIGN KEY (id_persona)
    REFERENCES PERSONA(id_persona)
    ON DELETE CASCADE,
    CONSTRAINT e_mo_d_mo_fk FOREIGN KEY (id_e_mo)
    REFERENCES E_MO(id_e_mo)
    ON DELETE CASCADE,
    CONSTRAINT ci_d_mo_fk FOREIGN KEY (id_cita)
    REFERENCES CITA (id_cita)
    ON DELETE CASCADE
)
;

CREATE TABLE D_RE(
	id_d_re INT AUTO_INCREMENT PRIMARY KEY,
    id_medicamento INT,
    id_receta INT,
    CONSTRAINT med_d_re_fk FOREIGN KEY (id_medicamento)
    REFERENCES MEDICAMENTO(id_medicamento)
    ON DELETE CASCADE ,
    CONSTRAINT re_d_re_fk FOREIGN KEY (id_receta)
    REFERENCES RECETA(id_receta)
    ON DELETE CASCADE 
)
;

CREATE TABLE PRUEBA_JSON(
	id INT AUTO_INCREMENT PRIMARY KEY,
    obj JSON
);


/**********************DROPS*************************/
DROP TABLE LOG;
DROP TABLE D_RE;

DROP TABLE D_MO;
DROP TABLE PAGO;
DROP TABLE RECETA;

DROP TABLE ESTUDIO;
DROP TABLE MA_D;
DROP TABLE CITA;

DROP TABLE CLIENTE;
DROP TABLE H_L;
DROP TABLE MASCOTA;
DROP TABLE MEDICO;
DROP TABLE USUARIO;
DROP TABLE DESCUENTO;

DROP TABLE E_DE;
DROP TABLE DIA;
DROP TABLE E_CI;
DROP TABLE E_MO;
DROP TABLE E_PA;
DROP TABLE E_US;
DROP TABLE ESPECIALIDAD;
DROP TABLE HORARIO;
DROP TABLE MEDICAMENTO;
DROP TABLE MONEDA;
DROP TABLE MOTIVO;
DROP TABLE PERSONA;
DROP TABLE RAZA;
DROP TABLE SALA;
DROP TABLE T_CI;
DROP TABLE T_CL;
DROP TABLE T_PA;
DROP TABLE T_US;


















