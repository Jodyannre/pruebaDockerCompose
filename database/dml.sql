#CARGAR RAZAS CON CSV razas.csv
SELECT * FROM RAZA;

#CARGAR MEDICAMENTOS DESDE CSV medicinas
SELECT * FROM MEDICAMENTO;

#CARGAR ESTADOS DE DESCUENTO
INSERT INTO E_DE(nombre) VALUES('Activo');
INSERT INTO E_DE(nombre) VALUES('Inactivo');
INSERT INTO E_DE(nombre) VALUES('Eliminado');


#CARGAR DIAS DE LA SEMANA
INSERT INTO DIA(nombre) VALUES('Lunes');
INSERT INTO DIA(nombre) VALUES('Martes');
INSERT INTO DIA(nombre) VALUES('Miércoles');
INSERT INTO DIA(nombre) VALUES('Jueves');
INSERT INTO DIA(nombre) VALUES('Viernes');
INSERT INTO DIA(nombre) VALUES('Sábado');
INSERT INTO DIA(nombre) VALUES('Domingo');
#SELECT * FROM DIA;

#CARGAR HORARIOS
INSERT INTO HORARIO(nombre,inicio,fin) VALUES ('8am - 4pm',STR_TO_DATE('08:00:00','%H:%i:%s'),
STR_TO_DATE('16:00:00','%H:%i:%s'));
INSERT INTO HORARIO(nombre,inicio,fin) VALUES ('4pm - 12am',STR_TO_DATE('16:00:00','%H:%i:%s'),
STR_TO_DATE('00:00:00','%H:%i:%s'));
INSERT INTO HORARIO(nombre,inicio,fin) VALUES ('12am - 8am',STR_TO_DATE('00:00:00','%H:%i:%s'),
STR_TO_DATE('08:00:00','%H:%i:%s'));
#SELECT * FROM HORARIO;
select * from f1ayd2.HORARIO;

/*
UPDATE f1ayd2.HORARIO
SET inicio = STR_TO_DATE('00:00:00','%H:%i:%s')
WHERE id_horario = 3;

UPDATE f1ayd2.HORARIO
SET fin = STR_TO_DATE('00:00:00','%H:%i:%s')
WHERE id_horario = 3;
*/

#CARGAR ESPECIALIDADES
INSERT INTO ESPECIALIDAD(nombre) VALUES ('Medicina General');
INSERT INTO ESPECIALIDAD(nombre) VALUES ('Traumatología');
INSERT INTO ESPECIALIDAD(nombre) VALUES ('Oftalmología');
INSERT INTO ESPECIALIDAD(nombre) VALUES ('Ginecología');
INSERT INTO ESPECIALIDAD(nombre) VALUES ('Análisis de Laboratorio');
#SELECT * FROM ESPECIALIDAD;

#CARGAR MOTIVOS
INSERT INTO MOTIVO(nombre,precio,tiempo) VALUES ('Medicina General',100,1);
INSERT INTO MOTIVO(nombre,precio,tiempo) VALUES ('Traumatología',200,1);
INSERT INTO MOTIVO(nombre,precio,tiempo) VALUES ('Oftalmología',200,1);
INSERT INTO MOTIVO(nombre,precio,tiempo) VALUES ('Ginecología',300,1);
INSERT INTO MOTIVO(nombre,precio,tiempo) VALUES ('Análisis de Laboratorio',500,1);
#SELECT * FROM MOTIVO;

#CARGAR SALAS
INSERT INTO SALA(nombre) VALUES ('Sala General 1');
INSERT INTO SALA(nombre) VALUES ('Sala General 2');
INSERT INTO SALA(nombre) VALUES ('Sala General 3');
INSERT INTO SALA(nombre) VALUES ('Traumatología');
INSERT INTO SALA(nombre) VALUES ('Oftalmología');
INSERT INTO SALA(nombre) VALUES ('Ginecología');
INSERT INTO SALA(nombre) VALUES ('Laboratorio');
#SELECT * FROM SALA;



#CARGAR MONEDAS
INSERT INTO MONEDA(nombre) VALUES ('Quetzal');
INSERT INTO MONEDA(nombre) VALUES ('Dolar');
#SELECT * FROM MONEDA;

#CARGAR TIPO DE PAGO
INSERT INTO T_PA(nombre) VALUES ('Efectivo');
INSERT INTO T_PA(nombre) VALUES ('Tarjeta de crédito');
#SELECT * FROM T_PA;

#CARGAR ESTADOS DEL MOTIVOS
INSERT INTO E_MO(nombre) VALUES ('En espera');
INSERT INTO E_MO(nombre) VALUES ('Activo');
INSERT INTO E_MO(nombre) VALUES ('Finalizado');
#SELECT * FROM E_MO;

#CARGAR ESTADO DEL PAGO
INSERT INTO E_PA(nombre) VALUES ('Pendiente');
INSERT INTO E_PA(nombre) VALUES ('Cancelado');
INSERT INTO E_PA(nombre) VALUES ('No pagado');
#SELECT * FROM E_PA;

#CARGAR ESTADO DE LA CITA
INSERT INTO E_CI(nombre) VALUES ('En espera');
INSERT INTO E_CI(nombre) VALUES ('Activa');
INSERT INTO E_CI(nombre) VALUES ('Finalizada');
#SELECT * FROM E_CI;

#CARGAR Tipo del cliente
INSERT INTO T_CL(nombre) VALUES ('Nuevo');
INSERT INTO T_CL(nombre) VALUES ('Recurrente');
#SELECT * FROM T_CL;

#CARGAR Estado del usuario
INSERT INTO E_US(nombre) VALUES ('Pendiente');
INSERT INTO E_US(nombre) VALUES ('De alta');
INSERT INTO E_US(nombre) VALUES ('De baja');
#SELECT * FROM E_US;

#CARGAR tipo del usuario
INSERT INTO T_US(nombre) VALUES ('Administrador');
INSERT INTO T_US(nombre) VALUES ('Médico');
INSERT INTO T_US(nombre) VALUES ('Secretaria');
INSERT INTO T_US(nombre) VALUES ('Cliente');
#SELECT * FROM T_US;

#CARGAR Tipos de citas
INSERT INTO T_CI(nombre) VALUES ('Normal');
INSERT INTO T_CI(nombre) VALUES ('Emergencia');
#SELECT * FROM T_CI;


#Insertar Descuentos
INSERT INTO DESCUENTO(nombre,cantidad,id_e_de)
VALUES ('Descuento de verano',5,1);

#CARGAR Descuentos
#INSERT INTO DESCUENTO(nombre,cantidad) VALUES ('2 motivos',10);
#INSERT INTO DESCUENTO(nombre,cantidad) VALUES ('3 motivos',20);
#INSERT INTO DESCUENTO(nombre,cantidad) VALUES ('4 motivos',30);
#SELECT * FROM DESCUENTO;
