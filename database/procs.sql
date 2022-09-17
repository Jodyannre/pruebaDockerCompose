#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS crearPersona
DELIMITER //
CREATE PROCEDURE crearPersona(
	IN tipoUsuarioIN INT,
    IN nombreIN VARCHAR(100),
    IN correoIN VARCHAR(100),
    IN edadIN INT,
    IN direccionIN VARCHAR(100),
    IN telefonoIN VARCHAR(100),
    IN passIN VARCHAR(256),
    IN nombreUsuarioIN VARCHAR(100),
    IN especialidadIN INT,
    IN horarioIN INT
)
this_proc:BEGIN
	DECLARE ultimaPersona INT;
    DECLARE repetido INT;
    DECLARE userRepetido INT;
    DECLARE altaUsuario INT;
    SET altaUsuario = 1;
    #Conseguir repetido
    SET repetido = (SELECT id_persona FROM PERSONA WHERE LOWER(nombre) = LOWER(nombreIN) 
    AND LOWER(correo) = LOWER(correoIN) limit 1);
    SET userRepetido = (SELECT id_usuario FROM USUARIO WHERE nombre_usuario = nombreUsuarioIN limit 1);
    #Error si es repetido
    IF repetido IS NOT NULL THEN
		SELECT 0 AS resultado;
		LEAVE this_proc;
    END IF;
    
    IF userRepetido IS NOT NULL THEN
		SELECT 2 AS resultado;
		LEAVE this_proc;    
    END IF;
    #Nueva persona
	INSERT INTO PERSONA (nombre,correo,edad,direccion,telefono)
	VALUES (nombreIN,correoIN,edadIN,direccionIN,telefonoIN);
    #Get el ultimo registro
	SET ultimaPersona = (SELECT id_persona FROM PERSONA ORDER BY id_persona DESC limit 1);
    #Crear perfil si persona es doctor o cliente
	IF tipoUsuarioIN = 4 THEN
		#El usuario es un cliente
        INSERT INTO CLIENTE (id_persona,id_t_cl)
        VALUES (ultimaPersona,1);
    ELSEIF tipoUsuarioIN = 2 THEN
		#El usuario es un doctor
        INSERT INTO MEDICO (id_persona,id_especialidad)
        VALUES (ultimaPersona,especialidadIN);	
        #Crear el horario
		INSERT INTO H_L (id_dia,id_horario,id_persona)
        VALUES (1,horarioIN,ultimaPersona);
        SET altaUsuario = 2;
	ELSEIF tipoUsuarioIN = 3 THEN
        #Crear el horario
		INSERT INTO H_L (id_dia,id_horario,id_persona)
        VALUES (1,horarioIN,ultimaPersona);  
        SET altaUsuario = 2;
    END IF;
    
    #Crear el usuario
    INSERT INTO USUARIO (nombre_usuario,pass,id_persona,id_e_us,id_t_us)
    VALUES (nombreUsuarioIN,passIN,ultimaPersona,altaUsuario,tipoUsuarioIN);
    SELECT 1 AS resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS crearPersonaEmergencia
DELIMITER //
CREATE PROCEDURE crearPersonaEmergencia(
	IN tipoUsuarioIN INT,
    IN nombreIN VARCHAR(100),
    IN correoIN VARCHAR(100),
    IN edadIN INT,
    IN direccionIN VARCHAR(100),
    IN telefonoIN VARCHAR(100),
    IN passIN VARCHAR(256),
    IN nombreUsuarioIN VARCHAR(100),
    IN especialidadIN INT,
    IN horarioIN INT
)
this_proc:BEGIN
	DECLARE ultimaPersona INT;
    DECLARE repetido INT;
    DECLARE userRepetido INT;
    DECLARE altaUsuario INT;
    SET altaUsuario = 2;
    #Conseguir repetido
    SET repetido = (SELECT id_persona FROM PERSONA WHERE LOWER(nombre) = LOWER(nombreIN) 
    AND LOWER(correo) = LOWER(correoIN) limit 1);
    SET userRepetido = (SELECT id_usuario FROM USUARIO WHERE nombre_usuario = nombreUsuarioIN limit 1);
    #Error si es repetido
    IF repetido IS NOT NULL THEN
		SELECT 0 AS resultado;
		LEAVE this_proc;
    END IF;
    
    IF userRepetido IS NOT NULL THEN
		SELECT 2 AS resultado;
		LEAVE this_proc;    
    END IF;
    #Nueva persona
	INSERT INTO PERSONA (nombre,correo,edad,direccion,telefono)
	VALUES (nombreIN,correoIN,edadIN,direccionIN,telefonoIN);
    #Get el ultimo registro
	SET ultimaPersona = (SELECT id_persona FROM PERSONA ORDER BY id_persona DESC limit 1);
    #Crear perfil si persona es doctor o cliente
	IF tipoUsuarioIN = 4 THEN
		#El usuario es un cliente
        INSERT INTO CLIENTE (id_persona,id_t_cl)
        VALUES (ultimaPersona,2);
    ELSEIF tipoUsuarioIN = 2 THEN
		#El usuario es un doctor
        INSERT INTO MEDICO (id_persona,id_especialidad)
        VALUES (ultimaPersona,especialidadIN);	
        #Crear el horario
		INSERT INTO H_L (id_dia,id_horario,id_persona)
        VALUES (1,horarioIN,ultimaPersona);
        SET altaUsuario = 2;
	ELSEIF tipoUsuarioIN = 3 THEN
        #Crear el horario
		INSERT INTO H_L (id_dia,id_horario,id_persona)
        VALUES (1,horarioIN,ultimaPersona);  
        SET altaUsuario = 2;
    END IF;
    
    #Crear el usuario
    INSERT INTO USUARIO (nombre_usuario,pass,id_persona,id_e_us,id_t_us)
    VALUES (nombreUsuarioIN,passIN,ultimaPersona,altaUsuario,tipoUsuarioIN);
    SELECT 1 AS resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS actualizarEstadoUsuario
DELIMITER //
CREATE PROCEDURE actualizarEstadoUsuario(
	IN idUsuarioIN INT,
    IN estadoIN INT
)
this_proc:BEGIN
	UPDATE USUARIO
    SET id_e_us = estadoIN
    WHERE id_usuario = idUsuarioIN;
    SELECT 1 AS resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS iniciarSesion
DELIMITER //
CREATE PROCEDURE iniciarSesion(
	IN usuarioIN VARCHAR(100)
)
this_proc:BEGIN
	DECLARE idUsuario INT;
    DECLARE passGuardada VARCHAR(256);
    DECLARE estadoUsuario INT;
    DECLARE tipoUsuario INT;
    #Verificar que el usuario exista
    SELECT id_usuario,id_e_us,id_t_us INTO idUsuario,estadoUsuario,tipoUsuario
    FROM USUARIO WHERE LOWER(nombre_usuario) = LOWER(usuarioIN);
    IF idUsuario IS NULL THEN
		SELECT 0 AS resultado;
        LEAVE this_proc;
    END IF;
    
    #Verificar que el usuario no este de baja
    IF estadoUsuario = 3 THEN
		SELECT 3 AS resultado;
        LEAVE this_proc;
    END IF;
    
    #Verificar que el usuario este de alta
    IF estadoUsuario = 1 THEN
		SELECT 4 AS resultado;
        LEAVE this_proc;
    END IF;    
    
    #Recuperar la contraseña
    SET passGuardada = (SELECT USUARIO.pass FROM USUARIO WHERE id_usuario = idUsuario);

    #Retornar datos para comparación en backend
	IF tipoUsuario = 2 THEN
		SELECT 1 AS resultado, id_usuario,nombre_usuario,pass, b.nombre AS estado,c.nombre AS tipo,
		d.nombre,d.correo,d.edad,d.direccion,d.telefono,f.nombre AS especialidad FROM USUARIO a
		INNER JOIN E_US b
		ON a.id_e_us = b.id_e_us
		INNER JOIN T_US c
		ON c.id_t_us = a.id_t_us
		INNER JOIN PERSONA d
		ON a.id_persona = d.id_persona
		INNER JOIN MEDICO e
		ON e.id_persona = a.id_persona
		INNER JOIN ESPECIALIDAD f
		ON e.id_especialidad = f.id_especialidad
		WHERE a.id_usuario = idUsuario;
		LEAVE this_proc;
	ELSE
		SELECT 1 AS resultado, id_usuario,nombre_usuario, b.nombre AS estado,c.nombre AS tipo,
		d.nombre,d.correo,d.edad,d.direccion,d.telefono FROM USUARIO a
		INNER JOIN E_US b
		ON a.id_e_us = b.id_e_us
		INNER JOIN T_US c
		ON c.id_t_us = a.id_t_us
		INNER JOIN PERSONA d
		ON a.id_persona = d.id_persona
		WHERE a.id_usuario = idUsuario;
		LEAVE this_proc;       
	END IF;
    LEAVE this_proc;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerMedicos
DELIMITER //
CREATE PROCEDURE obtenerMedicos(
)
this_proc:BEGIN
	#Retornar todos los médicos con los siguientes datos
    #Nombre-Especialidad-id_especialidad-Horario-id_horario
    SELECT a.nombre,c.id_especialidad,d.nombre AS especialidad,
    e.id_horario AS id_horario, f.nombre as horario FROM PERSONA a 
    INNER JOIN USUARIO b
    ON a.id_persona = b.id_persona
    INNER JOIN MEDICO c
    ON c.id_persona = b.id_persona
    INNER JOIN ESPECIALIDAD d
    ON c.id_especialidad = d.id_especialidad
    INNER JOIN H_L e
    ON e.id_persona = c.id_persona
    INNER JOIN HORARIO f
    ON f.id_horario = e.id_horario
    WHERE b.id_t_us = 2;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS crearMascota
DELIMITER //
CREATE PROCEDURE crearMascota(
	IN usuarioIN INT,
	IN nombreIN VARCHAR(100),
    IN edadIN INT,
    IN fotoIN VARCHAR(300),
    IN generoIN INT,
    IN razaIN INT
)
this_proc:BEGIN
	DECLARE yaExiste INT;
    DECLARE yaAsignada INT;
    DECLARE idMascota INT;
    SET yaExiste = (SELECT id_mascota FROM MASCOTA WHERE nombre = nombreIN);
    #Verificar si ya existe ese nombre de mascota
    IF yaExiste IS NOT NULL THEN
		#Verificar que esa mascota este al nombre del usuario
        SET yaAsignada = (SELECT id_mascota FROM MA_D WHERE id_usuario = usuarioIN
        AND id_mascota = yaExiste);
        IF yaAsignada IS NOT NULL THEN
			SELECT 0 AS resultado;
			LEAVE this_proc;
        END IF;
    END IF;
    #Crear la mascota
    INSERT INTO MASCOTA (nombre,edad,foto,genero,id_raza)
    VALUES (nombreIN,edadIN,fotoIN,generoIN,razaIN);
    #Recuperar id de la mascota
    SET idMascota = (SELECT id_mascota FROM MASCOTA ORDER BY id_mascota DESC limit 1);
    #Asignar mascota
    INSERT INTO MA_D (id_usuario,id_mascota)
    VALUES (usuarioIN,idMascota);
    SELECT 1 AS resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerUsuarios
DELIMITER //
CREATE PROCEDURE obtenerUsuarios(
	IN tipoUsuarioIN INT
)
this_proc:BEGIN
	#Retornar todos los usuarios
    SELECT a.id_usuario as id,a.nombre_usuario,b.nombre,b.correo,b.edad,b.direccion,
    b.telefono, c.id_e_us as estado, d.nombre as tipo FROM USUARIO a
    INNER JOIN PERSONA b
    ON a.id_persona = b.id_persona
    INNER JOIN E_US c
    ON a.id_e_us = c.id_e_us
    INNER JOIN T_US d
    ON a.id_t_us = d.id_t_us
    WHERE a.id_t_us = tipoUsuarioIN
    ;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerMascotas
DELIMITER //
CREATE PROCEDURE obtenerMascotas(
	IN usuarioIN INT
)
this_proc:BEGIN
	#Retornar todas las mascotas del usuario
    SELECT a.id_mascota,a.nombre,a.edad,a.foto,
    CASE WHEN a.genero = 1 THEN 'Masculino'
    WHEN a.genero = 2 THEN 'Femenino'
    END AS genero, b.nombre AS raza
    FROM MASCOTA a
    INNER JOIN RAZA b
    ON a.id_raza = b.id_raza
    INNER JOIN MA_D c
    ON a.id_mascota = c.id_mascota
    WHERE c.id_usuario = usuarioIN
    ;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS crearRaza
DELIMITER //
CREATE PROCEDURE crearRaza(
	IN razaIN VARCHAR(100)
)
this_proc:BEGIN
	DECLARE razaRepetida INT;
    SELECT id_raza INTO razaRepetida FROM RAZA WHERE LOWER(nombre) = LOWER(razaIN); 
    #Verificar que la raza ya exista.
    IF razaRepetida IS NOT NULL THEN
		SELECT 0 AS resultado;
		LEAVE this_proc;
    END IF;
    #Crear la raza
    INSERT INTO RAZA (nombre) 
    VALUES (razaIN);
    SELECT 1 AS resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerRazas
DELIMITER //
CREATE PROCEDURE obtenerRazas(
)
this_proc:BEGIN
	#Retornar todas las mascotas del usuario
    SELECT * FROM RAZA ORDER BY nombre ASC;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS manejarDescuento
DELIMITER //
CREATE PROCEDURE manejarDescuento(
	IN tipoAccionIN INT,
    IN nombreNuevoIN VARCHAR(100),
    IN cantidadNuevoIN NUMERIC(6,2),
    IN idDescuentoIN INT
)
this_proc:BEGIN
	DECLARE nombreRepetido INT;
    DECLARE descuentoActivo INT;
    DECLARE descuentoEliminado INT;
    #Verificar si existe el nombre
    SET nombreRepetido = (SELECT id_descuento FROM DESCUENTO 
	WHERE LOWER(nombre) = LOWER(nombreNuevoIN));

	IF tipoAccionIN = 1 THEN
    	IF nombreRepetido IS NOT NULL THEN
		#ERROR, nombre ya existe
			SELECT 0 AS resultado;
			LEAVE this_proc;
		END IF;
    #Crear nuevo descuento
		INSERT INTO DESCUENTO (nombre,cantidad,id_e_de)
        VALUES (nombreNuevoIN,cantidadNuevoIN,1);
        SELECT 1 AS resultado;
        LEAVE this_proc;
    END IF;
    #Recuperar estado eliminado
    SET descuentoEliminado = (SELECT id_e_de FROM DESCUENTO 
    WHERE id_descuento = idDescuentoIN);
    
    IF tipoAccionIN = 3 THEN
		#Desactivar descuento
        #Verificar que el descuento no este eliminado
        IF descuentoEliminado = 3 THEN
			SELECT 3 AS resultado;
            LEAVE this_proc;
        END IF;
        #Activar descuento 
        UPDATE DESCUENTO SET id_e_de = 2 WHERE id_descuento = idDescuentoIN;
	END IF;
    
    IF tipoAccionIN = 2 THEN
    #Activar descuento
    #Verificar si no hay otro descuento activo.
		SELECT COUNT(id_descuento) INTO descuentoActivo FROM DESCUENTO 
        WHERE id_e_de = 1;
        /*
		IF descuentoActivo > 0 THEN
		#ERROR, ya hay un descuento activado
			SELECT 2 AS resultado;
			LEAVE this_proc;
		END IF;
        */
        #Verificar que el descuento no este eliminado
        IF descuentoEliminado = 3 THEN
			SELECT 3 AS resultado;
            LEAVE this_proc;
        END IF;
        #Activar descuento 
        UPDATE DESCUENTO SET id_e_de = 1 WHERE id_descuento = idDescuentoIN;
	END IF;

    IF tipoAccionIN = 4 THEN
		#Eliminar descuento
        #Verificar que el descuento no este eliminado
        IF descuentoEliminado = 3 THEN
			SELECT 3 AS resultado;
            LEAVE this_proc;
        END IF;
        #Activar descuento 
        UPDATE DESCUENTO SET id_e_de = 3 WHERE id_descuento = idDescuentoIN;
	END IF;
    SELECT 1 AS resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerDescuentos
DELIMITER //
CREATE PROCEDURE obtenerDescuentos(
)
this_proc:BEGIN
	#Retornar todas las mascotas del usuario
    SELECT id_descuento AS id, nombre, cantidad, id_e_de AS estado 
    FROM DESCUENTO;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////

select * from E_DE;

#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS crearEstudio
DELIMITER //
CREATE PROCEDURE crearEstudio(
	IN nombreIN VARCHAR(100),
    IN direccionIN VARCHAR(300),
    IN id_mascotaIN INT
)
this_proc:BEGIN
	#Crear nuevo estudio
    INSERT INTO ESTUDIO (direccion,nombre,id_mascota)
	VALUES (direccionIN,nombreIN,id_mascotaIN)
	;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerEstudios
DELIMITER //
CREATE PROCEDURE obtenerEstudios(
    IN id_mascotaIN INT
)
this_proc:BEGIN
	#Obtener estudios de mascota
    SELECT id_estudio as id,direccion,nombre FROM ESTUDIO WHERE id_mascota = id_mascotaIN;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerCalendarioOcupadoDoctor
DELIMITER //
CREATE PROCEDURE obtenerCalendarioOcupadoDoctor(
    IN idMedicoIN INT
)
this_proc:BEGIN
	SELECT c.fecha,a.hora_inicio as inicio, a.hora_fin as fin, a.id_sala, b.nombre as sala,
    a.id_cita,d.nombre as tipo_cita, e.nombre as medico FROM D_MO a
    INNER JOIN SALA b
    ON a.id_sala = b.id_sala
    INNER JOIN CITA c
    ON c.id_cita = a.id_cita
    INNER JOIN T_CI d
    ON d.id_t_ci = c.id_t_ci
    INNER JOIN PERSONA e
    ON e.id_persona = a.id_persona
    WHERE c.id_e_ci != 3 
    AND e.id_persona = idMedicoIN
    ORDER BY c.fecha,a.hora_inicio,a.hora_fin,a.id_sala DESC
    ;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerCalendarioOcupadoGeneral
DELIMITER //
CREATE PROCEDURE obtenerCalendarioOcupadoGeneral(
)
this_proc:BEGIN
	SELECT c.fecha,a.hora_inicio as inicio, a.hora_fin as fin, a.id_sala, b.nombre as sala,
    a.id_cita,d.nombre as tipo_cita, e.nombre as medico FROM D_MO a
    INNER JOIN SALA b
    ON a.id_sala = b.id_sala
    INNER JOIN CITA c
    ON c.id_cita = a.id_cita
    INNER JOIN T_CI d
    ON d.id_t_ci = c.id_t_ci
    INNER JOIN PERSONA e
    ON e.id_persona = a.id_persona
    WHERE c.id_e_ci != 3 
    ORDER BY c.fecha,a.hora_inicio,a.hora_fin,a.id_sala DESC
    ;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS crearCita
DELIMITER //
CREATE PROCEDURE crearCita(
    IN fechaIN VARCHAR(10),
    IN idMascotaIN INT,
    #IN idDescuentoIN INT,
    IN idTipoCitaIN INT
)
this_proc:BEGIN
	DECLARE idCita INT;
	#fecha, costo, id_mascota, id_descuento, id_e_ci, id_t_ci
    INSERT INTO CITA (fecha,costo,id_mascota,/*id_descuento,*/id_e_ci,id_t_ci)
    VALUES (STR_TO_DATE(fechaIN,'%d-%m-%Y'),0,idMascotaIN,/*idDescuentoIN,*/1,idTipoCitaIN);
    SET idCita = (SELECT id_cita FROM CITA ORDER BY id_cita DESC limit 1);
    #Crear el pago
    #total, id cita, estado pago 1 pendiente, tipo pago 1 efectivo, id moneda 1 quetzal
    INSERT INTO PAGO (total,id_cita,id_e_pa,id_t_pa,id_moneda)
    VALUES (0,idCita,1,1,1);
    SELECT idCita;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS agregarMotivo
DELIMITER //
CREATE PROCEDURE agregarMotivo(
	IN horaInicioIN VARCHAR(10),
    IN idMotivoIN INT,
    IN idSalaIN INT,
    IN idCitaIN INT,
    IN idMedicoIN INT
)
this_proc:BEGIN
	DECLARE tipoCita INT;
    DECLARE costoLocal NUMERIC(8,2);
    DECLARE horaInicio TIME;
    DECLARE horaFin TIME;
    DECLARE totalLocal NUMERIC(8,2);
    DECLARE tarifaExamen NUMERIC(8,2);
    DECLARE totalAnterior NUMERIC(8,2);
    DECLARE cantidadMotivos INT;
    DECLARE descuentoActivo INT;
    #Convertir horainicio
    SET horaInicio = STR_TO_DATE(horaInicioIN,'%H:%i:%s');
    #Calcular hora final
	#inicio,motivo,sala,cita,persona/medico
	#Conseguir el tipo de cita para el calculo del  costo
    SET tipoCita = (SELECT id_t_ci FROM CITA WHERE id_cita = idCitaIN);
    SET totalAnterior = (SELECT a.total FROM PAGO a WHERE id_cita = idCitaIN);
	IF tipoCita = 1 THEN
		SET costoLocal = (SELECT precio FROM MOTIVO WHERE id_motivo = idMotivoIN);
        SET horaFin = DATE_ADD(horaInicio, INTERVAL 1 HOUR);
        #Actualizar costo de la cita
        SET totalLocal = (SELECT a.costo FROM CITA a WHERE id_cita = idCitaIN);
		 UPDATE CITA
		 SET costo = (totalLocal + costoLocal)
		 WHERE id_cita = idCitaIN;
    ELSE
		SET costoLocal = 0;
        SET horaFin = horaInicio;
    END IF;
    #Insertar nuevo motivo
	INSERT INTO D_MO (costo,hora_inicio,hora_fin,id_motivo,id_sala,id_cita,id_persona,id_e_mo)
    VALUES (costoLocal,horaInicio,horaFin,idMotivoIN,idSalaIN,idCitaIN,idMedicoIN,1);
    
    #Actualizar costo si es cita normal
    IF tipoCita = 1 THEN
		#Conseguir el precio del servicio
		SET tarifaExamen = (SELECT precio FROM MOTIVO WHERE id_motivo = idMotivoIN);
        
		#Actualizar el total de la factura
        UPDATE PAGO 
        SET total = (totalAnterior+tarifaExamen)
        WHERE id_cita = idCitaIN;
    END IF;
    #Verificar si hay que aplicar descuento
    SET cantidadMotivos = (SELECT COUNT(id_d_mo) FROM D_MO WHERE id_cita = idCitaIN);
    IF cantidadMotivos > 1 THEN
		#Recuperar el descuento activo
        SET descuentoActivo = (SELECT id_descuento FROM DESCUENTO WHERE id_e_de = 1 limit 1);
        IF descuentoActivo IS NOT NULL THEN 
			UPDATE CITA
            SET id_descuento = descuentoActivo
            WHERE id_cita = idCitaIN;
        END IF;
    END IF;
    SELECT 1 as resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS actualizarMotivo
DELIMITER //
CREATE PROCEDURE actualizarMotivo(
	IN idMotivoIN VARCHAR(10),
    IN tipoAccionIN INT
)
this_proc:BEGIN
/*
	Acciones
    1 -> Activar motivo
    2 -> Finalizar motivo
*/
	DECLARE idCita INT;
    DECLARE tipoCita INT;
    DECLARE tipoCliente INT;
    DECLARE horaInicio TIME;
    DECLARE horaFin TIME;
    DECLARE tiempoEmergencia INT;
    DECLARE costoEmergencia NUMERIC(8,2);
    DECLARE costoExtra INT DEFAULT 1;
    DECLARE motivosRestantes INT;
    DECLARE totalConDescuento NUMERIC(8,2);
    DECLARE descuentoAaplicar NUMERIC(8,2);
    DECLARE conteoCitas INT;
    DECLARE idCliente INT;
    #Recuperar la cita de ese motivo y el tipo de cita
    SELECT a.id_cita, b.id_t_ci INTO idCita,tipoCita FROM D_MO a
    INNER JOIN CITA b
    ON a.id_cita = b.id_cita
    WHERE a.id_d_mo = idMotivoIN;
    
    IF tipoAccionIN = 1 THEN
		UPDATE D_MO
		SET id_e_mo = 2
		WHERE id_d_mo = idMotivoIN;
        SELECT 1 as resultado;
		LEAVE this_proc;
    END IF;
	#Actualizar estado del motivo
	UPDATE D_MO
	SET id_e_mo = 3
	WHERE id_d_mo = idMotivoIN;
    #Verificar si es de emergencia y actualizar la fecha fin y el precio
    /*
		Precio:
        Tiempo * 35
        Si es mayor a 5 horas se multiplica por 30
    */
    IF tipoCita = 2 THEN
    
		UPDATE D_MO
        SET hora_fin = NOW()
        WHERE id_d_mo = idMotivoIN;
        #Recuperar las horas
        SELECT hora_inicio,hora_fin INTO horaInicio,horaFin FROM D_MO
        WHERE id_d_mo = idMotivoIN;
        #Calcular tiempo del motivo
        SET tiempoEmergencia = (SELECT time_to_sec(timediff(horaInicio, horaFin))/60);
        #Verificar el tema de las 5 horas
        IF tiempoEmergencia > 300 THEN
			SET costoExtra = 30;
        END IF;
        WHILE tiempoEmergencia > 60 DO
			SET tiempoEmergencia = tiempoEmergencia - 60;
			SET costoEmergencia = costoEmergencia + 35;
		END WHILE;
        #Agregar los minutos que queden sobrando
        IF tiempoEmergencia > 0 THEN
			SET costoEmergencia = costoEmergencia + (tiempoEmergencia * 30);
        END IF;
        #Agregar el precio extra por las 5 horas
        SET costoEmergencia = costoEmergencia * costoExtra;
        #Actualizar el costo de la cita y del pago
        UPDATE CITA
        SET costo = (SELECT costo FROM CITA WHERE id_cita = idCita) + costoEmergencia
        WHERE id_cita = idCita;
        UPDATE PAGO
        SET total = (SELECT total FROM PAGO WHERE id_cita = idCita) + costoEmergencia
        WHERE id_cita = idCita;
    END IF;
	#idCita
    CALL calcularTotal(idCita);
    SELECT 1 as resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////



#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS cambiarTipoCliente
DELIMITER //
CREATE PROCEDURE cambiarTipoCliente(
    IN idClienteIN VARCHAR(10)
)
this_proc:BEGIN
	DECLARE conteoCitas INT;
	#Cambiar estado de cliente por si se volvio recurrente
	SET conteoCitas = (SELECT COUNT(id_cita) FROM CITA a
	INNER JOIN MASCOTA b
	ON a.id_mascota = b.id_mascota
	INNER JOIN MA_D c
	ON b.id_mascota = c.id_mascota
	INNER JOIN USUARIO d
	ON d.id_usuario = c.id_usuario
	INNER JOIN CLIENTE e
	ON d.id_persona = e.id_persona
	WHERE e.id_persona = idClienteIN);
    
	IF conteoCitas >= 2 THEN
		UPDATE CLIENTE
		SET id_t_cl = 2
		WHERE id_persona = idClienteIN;
	END IF;
    
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS calcularTotal
DELIMITER //
CREATE PROCEDURE calcularTotal(
    IN idCitaIN INT
)
this_proc:BEGIN
	DECLARE motivosRestantes INT;
    DECLARE totalConDescuento NUMERIC(8,2);
    DECLARE tipoCliente INT;
    DECLARE idCliente INT;
    DECLARE descuentoAaplicar NUMERIC(8,2);
    
	#Verifiar que todos los motivos esten cerrados para calcular los descuentos
    SET motivosRestantes = (SELECT COUNT(id_motivo) FROM D_MO 
    WHERE id_cita = idCitaIN
    AND id_e_mo = 1 OR id_e_mo = 2);
	
    IF motivosRestantes = 0 THEN
		#Finalizar cita
		UPDATE CITA
        SET id_e_ci = 3
        WHERE id_cita = idCitaIN;
        #Recuperar total sin descuento
		SET totalConDescuento = (SELECT costo FROM CITA WHERE id_cita = idCitaIN);
        #Recuperar el tipo del cliente
        SELECT e.id_t_cl, e.id_persona INTO tipoCliente, idCliente FROM CITA a
        INNER JOIN MASCOTA b
        ON a.id_mascota = b.id_mascota
        INNER JOIN MA_D c
        ON b.id_mascota = c.id_mascota
        INNER JOIN USUARIO d
        ON d.id_usuario = c.id_usuario
        INNER JOIN CLIENTE e
        ON d.id_persona = e.id_persona
        WHERE a.id_cita = idCitaIN;
        #Agregar descuento del 15% si es cliente recurrente
        IF tipoCliente = 2 THEN
			SET totalConDescuento = totalConDescuento - (totalConDescuento * 0.15);
        END IF;
        #Agregar demas descuentos si existen descuentos agregados
        SET descuentoAaplicar = (SELECT cantidad FROM CITA a 
        INNER JOIN DESCUENTO b
        ON a.id_descuento = b.id_descuento
        WHERE id_cita = idCitaIN
        );
		IF descuentoAaplicar IS NOT NULL THEN
			SET totalConDescuento = totalConDescuento - (totalConDescuento * descuentoAaplicar);
        END IF;
        #Actualizar el pago
        UPDATE PAGO
        SET total = totalConDescuento
        WHERE id_cita = idCitaIN;
		#idCliente
		CALL cambiarTipoCliente(idCliente);
    END IF;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS crearReceta
DELIMITER //
CREATE PROCEDURE crearReceta(
    IN idCitaIN INT
)
this_proc:BEGIN
	DECLARE idReceta INT;
	INSERT INTO RECETA (id_cita) VALUES (idCitaIN);
    SET idReceta = (SELECT id_receta FROM RECETA ORDER BY id_receta DESC limit 1);
    SELECT idReceta as receta;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS agregarElementoReceta
DELIMITER //
CREATE PROCEDURE agregarElementoReceta(
    IN idRecetaIN INT,
    IN idMedicamentoIN INT
)
this_proc:BEGIN
	INSERT INTO D_RE (id_medicamento,id_receta) VALUES (idMedicamentoIN,idRecetaIN);
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerHistorialMedico
DELIMITER //
CREATE PROCEDURE obtenerHistorialMedico(
    IN idMascotaIN INT
)
this_proc:BEGIN
	SELECT a.fecha,c.nombre as motivo,d.nombre as medico
    FROM CITA a
    INNER JOIN D_MO b
    ON a.id_cita = b.id_cita
    INNER JOIN MOTIVO c
    ON b.id_motivo = c.id_motivo
    INNER JOIN PERSONA d
    ON b.id_persona = d.id_persona
    GROUP BY a.fecha,c.nombre ,d.nombre;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerRecetas
DELIMITER //
CREATE PROCEDURE obtenerRecetas(
    IN idMascotaIN INT
)
this_proc:BEGIN
SELECT e.id_receta as receta, a.fecha,c.nombre as motivo,d.nombre as medico, g.nombre as medicina
    FROM CITA a
    INNER JOIN D_MO b
    ON a.id_cita = b.id_cita
    INNER JOIN MOTIVO c
    ON b.id_motivo = c.id_motivo
    INNER JOIN PERSONA d
    ON b.id_persona = d.id_persona
    INNER JOIN RECETA e
    ON e.id_cita = b.id_cita
    INNER JOIN D_RE f
    ON e.id_receta = f.id_receta
    INNER JOIN MEDICAMENTO g
    ON g.id_medicamento = f.id_medicamento
    GROUP BY a.fecha,c.nombre ,d.nombre,g.nombre;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerSalas
DELIMITER //
CREATE PROCEDURE obtenerSalas(

)
this_proc:BEGIN
	SELECT id_sala as id, nombre from SALA;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS obtenerPagoGenerado
DELIMITER //
CREATE PROCEDURE obtenerPagoGenerado(
	IN idUsuarioIN INT
)
this_proc:BEGIN
	SELECT a.id_pago as id,a.total,a.id_cita as cita, b.nombre as estado FROM PAGO a
    INNER JOIN E_PA b
    ON a.id_e_pa = b.id_e_pa
    INNER JOIN CITA c
    ON a.id_cita = c.id_cita
    INNER JOIN MA_D d
    ON c.id_mascota = d.id_mascota
    INNER JOIN USUARIO e
    ON d.id_usuario = e.id_usuario
    WHERE e.id_usuario = idUsuarioIN
    AND a.id_e_pa=1
    ORDER BY a.id_pago DESC LIMIT 1;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


#//////////////////////////////////////////////////////////////////////////////////////
DROP PROCEDURE IF EXISTS pagar
DELIMITER //
CREATE PROCEDURE pagar(
	IN idPagoIN INT,
    IN idTipoPagoIN INT
)
this_proc:BEGIN
	UPDATE PAGO
    SET id_e_pa = 2
    WHERE id_pago = idPagoIN;
 
 	UPDATE PAGO
    SET id_t_pa = idTipoPagoIN
    WHERE id_pago = idPagoIN;
    
    SELECT 1 as resultado;
END //;
DELIMITER ;
#//////////////////////////////////////////////////////////////////////////////////////


/*
#INSERTAR NUEVO JSON
INSERT INTO PRUEBA_JSON (obj)
VALUES ('{"nombre":"baño"}')

#ACCEDER A UN ATRIBUTO DEL JSON
SELECT obj->'$.nombre' FROM PRUEBA_JSON
WHERE JSON_EXTRACT(obj,'$.nombre') = 'ojo';
*/
#*************************************CREAR PERSONA********************************************
#tipoUs,nombre,correo,edad,direccion,tel,pass,user,especialidad,horario
CALL crearPersona(2,'Jose Ramon','jose@gmail.com',28,'zona 10','12345678','1234','user1',1,1);
CALL crearPersona(2,'Jose Quiñonez','joseQ@gmail.com',28,'zona 10','12345678','1234','user2',2,2);
CALL crearPersona(2,'Josed Ral','josess@gmail.com',28,'zona 10','12345678','1234','user3',3,1);
CALL crearPersona(2,'Adal Ramones','adal@gmail.com',45,'México','12345678','1234','user4',4,3);
CALL crearPersona(4,'Jordi Rosado','jordi@gmail.com',45,'México','12345678','1234','user5',4,3);
CALL crearPersonaEmergencia(4,'Jordi Amarillo','jordiz@gmail.com',45,'México','12345678','1234','user6',4,3);
SELECT * FROM PERSONA;
SELECT * FROM CLIENTE;
SELECT * FROM MEDICO;
SELECT * FROM H_L;
SELECT * FROM USUARIO;
SELECT * FROM T_US;
SELECT * FROM E_US;
#**********************************************************************************************




#*************************************ACTUALIZAR ESTADO USUARIO********************************
#idUsuario,estadoNuevo
call actualizarEstadoUsuario(5,2);
SELECT * FROM USUARIO;
#**********************************************************************************************


#*************************************INICIAR SESIÓN*******************************************
#idUsuario,estadoNuevo
call iniciarSesion('user3');
SELECT * FROM USUARIO;
#**********************************************************************************************

#*************************************OBTENER MEDICOS******************************************
call obtenerMedicos();
#**********************************************************************************************


#************************************OBTENER USUARIOS******************************************
call obtenerUsuarios(4);
#**********************************************************************************************


#*************************************CREAR MASCOTA********************************************
#usuario,nombre,edad,foto,genero,raza
CALL crearMascota(5,'Kindy',2,'fotos/foto2',2,15);

SELECT * FROM USUARIO;
SELECT * FROM E_US;
SELECT * FROM MASCOTA;
SELECT * FROM MA_D;
SELECT * FROM RAZA;
#**********************************************************************************************

#************************************OBTENER MASCOTAS******************************************
call obtenerMascotas(3);
#**********************************************************************************************


#************************************CREAR RAZAS***********************************************
call crearRaza('Selenium');
#**********************************************************************************************

#************************************OBTENER RAZAS*********************************************
call obtenerRazas();
#**********************************************************************************************

#*****************************************MANEJAR DESCUENTOS***********************************
#tipoAActividad,nombre,cantidad,id_descuento
#Crear
call manejarDescuento(1,'segundo',5,0);
#Activar
call manejarDescuento(2,'segundo',5,2);
#Desactivar
call manejarDescuento(3,'segundo',5,1);
#Eliminar
call manejarDescuento(4,'segundo',5,1);
use f1ayd2;
select * from DESCUENTO;
select * from e_de;
#**********************************************************************************************


#************************************OBTENER DESCUENTOS****************************************
call obtenerDescuentos();
#**********************************************************************************************


#**************************************CREAR ESTUDIO*******************************************
#nombre,direccion,mascota
call crearEstudio('Estudio 1','estudios/estudio.pdf',1);
#**********************************************************************************************

#**************************************OBTENER ESTUDIOS****************************************
#id mascota
call obtenerEstudios(1);
#**********************************************************************************************


#*****************************************CREAR LOG********************************************
INSERT INTO LOG (metodo,entrada,salida,esError,fechaHora)
VALUES ('metodo1','entrada1','salida1',0,NOW());

INSERT INTO LOG (metodo,entrada,salida,esError,fechaHora)
VALUES ('metodo2','entrada2','salida2',0,STR_TO_DATE('10-09-2022 17:20:50', '%d-%m-%Y %H:%i:%s'));
#**********************************************************************************************


#****************************************CREAR CITA********************************************
INSERT INTO CITA (fecha,costo,id_mascota,id_descuento,id_e_ci,id_t_ci)
VALUES (STR_TO_DATE('10-09-2022','%d-%m-%Y'),0,1,1,1,1);


INSERT INTO LOG (metodo,entrada,salida,esError,fechaHora)
VALUES ('metodo2','entrada2','salida2',0,STR_TO_DATE('10-09-2022 17:20:50', '%d-%m-%Y %H:%i:%s'));
#**********************************************************************************************


#*****************************************CREAR CITA*******************************************
# fecha,mascota,tipoCita
call crearCita('25-09-2022',1,1);
#**********************************************************************************************


#*****************************************AGREGAR MOTIVO***************************************
# inicio,motivo,sale,cita,medico
call agregarMotivo('08:00:00',1,1,3,1);
#**********************************************************************************************


#**************************************ACTUALIZAR MOTIVO***************************************
# id_motivo, accion
call actualizarMotivo(4,3);

#**********************************************************************************************


#***********************************OBTENER CALENDARIOS****************************************
# fecha,mascota,descuento,tipoCita
call obtenerCalendarioOcupadoGeneral();
call obtenerCalendarioOcupadoDoctor(1);
#**********************************************************************************************


#**************************************OBTENER SALAS*******************************************
# id_motivo, accion
call obtenerSalas();
#**********************************************************************************************

#**************************************OBTENER HISTORIAL***************************************
# id_motivo, accion
call obtenerHistorialMedico(1);
#**********************************************************************************************

#**************************************CREAR RECETA********************************************
# id_mascota
call crearReceta(2);
#**********************************************************************************************

#******************************AGREGAR ELEMENTO RECETA*****************************************
# id_receta id_medicina
call agregarElementoReceta(1,1);
#**********************************************************************************************


#******************************AGREGAR ELEMENTO RECETA*****************************************
# id_usuario
call obtenerPagoGenerado(1);
#**********************************************************************************************


#******************************AGREGAR ELEMENTO RECETA*****************************************
# id_pago, id_tipo pago
call pagar(1,1);
#**********************************************************************************************

