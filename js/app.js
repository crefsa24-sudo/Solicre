(function () {
    'use strict';

    // ========================================
    // CONFIGURACIÓN
    // ========================================
    var NUMERO = '522491103620';
    var MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

    // ========================================
    // UTILERÍAS
    // ========================================
    var $ = function (id) { return document.getElementById(id); };
    var v = function (id) { var el = $(id); return el ? el.value.trim() : ''; };
    var num = function (id) { var n = parseFloat(v(id).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
    var fmt = function (n) { return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var radio = function (name) { var r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; };

    var form = $('formCredito');
    var aviso = $('aviso');
    var btnEnviar = $('btnEnviar');
    var btnDescargar = $('btnDescargar');

    // ========================================
    // FUNCIONES DE PDF
    // ========================================
    function set(id, valor) { var el = $(id); if (el) el.textContent = valor || ''; }

    function marcar(id, activo) {
        var el = $(id);
        if (el) {
            el.textContent = activo ? 'X' : '';
            el.className = 'caja' + (activo ? ' caja-x' : '');
        }
    }

    function fechas(iso) {
        if (!iso) return ['', '', ''];
        var p = iso.split('-');
        var mes = MESES[parseInt(p[1], 10) - 1] || '';
        return [p[2] || '', mes, p[0] || ''];
    }

    // ========================================
    // RECÁLCULO DE INGRESOS Y GASTOS
    // ========================================
    function recalc() {
        // Cliente
        var cliIng = num('cliSueldo') + num('cliOtrosIngresos');
        $('cliTotalIngresos').value = fmt(cliIng);

        var cliGas = num('cliGastoRenta') + num('cliGastoAlimentos') +
            num('cliGastoServicios') + num('cliGastoTransporte') +
            num('cliGastoEstudio') + num('cliGastoOtros');
        $('cliTotalGastos').value = fmt(cliGas);

        var cliDif = cliIng - cliGas;
        $('capIngresos').value = fmt(cliIng);
        $('capEgresos').value = fmt(cliGas);
        $('capDiferencia').value = fmt(cliDif);
        $('capSemanal').value = fmt(cliDif / 4);

        // Aval
        var avIng = num('avalSueldo') + num('avalOtrosIngresos');
        $('avalTotalIngresos').value = fmt(avIng);

        var avGas = num('avalGastoRenta') + num('avalGastoAlimentos') +
            num('avalGastoServicios') + num('avalGastoTransporte') +
            num('avalGastoEstudio') + num('avalGastoOtros');
        $('avalTotalGastos').value = fmt(avGas);

        var avDif = avIng - avGas;
        $('avalCapIngresos').value = fmt(avIng);
        $('avalCapEgresos').value = fmt(avGas);
        $('avalCapDiferencia').value = fmt(avDif);
        $('avalCapSemanal').value = fmt(avDif / 4);
    }

    // ========================================
    // LLENAR VISTA PREVIA DEL PDF
    // ========================================
    function fillPdf() {
        // Encabezado
        set('pfFecha', v('encFecha'));
        set('pfEjecutivo', v('encEjecutivo'));
        set('pfZona', v('encZona'));
        set('pfProducto', v('encProducto'));

        // Cliente
        var fNac = fechas(v('cliFechaNac'));
        set('pfCliNombre', v('cliNombre'));
        set('pfCliApPaterno', v('cliApPaterno'));
        set('pfCliApMaterno', v('cliApMaterno'));
        set('pfCliDia', fNac[0]);
        set('pfCliMes', fNac[1]);
        set('pfCliAnio', fNac[2]);

        var sx = radio('cliSexo');
        marcar('pfCliSexoM', sx === 'M');
        marcar('pfCliSexoF', sx === 'F');
        set('pfCliEstadoCivil', v('cliEstadoCivil'));

        set('pfCliCel1', v('cliCelPersonal'));
        set('pfCliCel2', v('cliCelReferencia'));
        set('pfCliCurp', v('cliCurp'));

        set('pfCliCalle', v('cliCalle'));
        set('pfCliColonia', v('cliColonia'));
        set('pfCliMunicipio', v('cliMunicipio'));
        set('pfCliEstado', v('cliEstado'));
        set('pfCliCp', v('cliCp'));

        var vv = radio('cliVivienda');
        marcar('pfCliVivPropia', vv === 'Propia');
        marcar('pfCliVivRentada', vv === 'Rentada');
        marcar('pfCliVivFamiliar', vv === 'Familiares');
        set('pfCliTiempo', v('cliTiempoResidencia'));

        set('pfCliEmail', v('cliEmail'));
        set('pfConyugeNombre', v('conyugeNombre'));
        set('pfConyugeCel', v('conyugeCelular'));

        // Actividad económica Cliente
        set('pfCliOcupacion', v('cliOcupacion'));
        set('pfCliEmpresa', v('cliEmpresa'));
        set('pfCliDirTra', v('cliDirTrabajo'));
        set('pfCliSueldo', v('cliSueldo'));

        var cc = radio('cliComprueba');
        marcar('pfCliCompSi', cc === 'Sí');
        marcar('pfCliCompNo', cc === 'No');
        set('pfCliOtros', v('cliOtrosIngresos'));
        set('pfCliTotalIng', v('cliTotalIngresos'));

        // Gastos Cliente
        set('pfG1Renta', v('cliGastoRenta'));
        set('pfG2Alimentos', v('cliGastoAlimentos'));
        set('pfG3Servicios', v('cliGastoServicios'));
        set('pfG4Transporte', v('cliGastoTransporte'));
        set('pfG5Estudio', v('cliGastoEstudio'));
        set('pfG6Otros', v('cliGastoOtros'));
        set('pfTotalGastos', v('cliTotalGastos'));

        // Capacidad Cliente
        set('pfCapIngresos', v('capIngresos'));
        set('pfCapEgresos', v('capEgresos'));
        set('pfCapDiferencia', v('capDiferencia'));
        set('pfCapSemanal', v('capSemanal'));

        // Crédito
        set('pfMonto', v('montoSolicitado'));
        set('pfPlazo', v('plazoSemanas'));
        var op = radio('tipoOperacion');
        marcar('pfCliNuevo', op === 'Cliente nuevo');
        marcar('pfRenovacion', op === 'Renovación');

        // Aval
        var aNac = fechas(v('avalFechaNac'));
        set('pfAvalNombre', v('avalNombre'));
        set('pfAvalApPaterno', v('avalApPaterno'));
        set('pfAvalApMaterno', v('avalApMaterno'));
        set('pfAvalDia', aNac[0]);
        set('pfAvalMes', aNac[1]);
        set('pfAvalAnio', aNac[2]);

        var asx = radio('avalSexo');
        marcar('pfAvalSexoM', asx === 'M');
        marcar('pfAvalSexoF', asx === 'F');
        set('pfAvalEstadoCivil', v('avalEstadoCivil'));

        set('pfAvalCel1', v('avalCelPersonal'));
        set('pfAvalCel2', v('avalCelReferencia'));
        set('pfAvalEmail', v('avalEmail'));

        set('pfAvalCalle', v('avalCalle'));
        set('pfAvalColonia', v('avalColonia'));
        set('pfAvalMunicipio', v('avalMunicipio'));
        set('pfAvalEstado', v('avalEstado'));
        set('pfAvalCp', v('avalCp'));

        var avv = radio('avalVivienda');
        marcar('pfAvalVivPropia', avv === 'Propia');
        marcar('pfAvalVivRentada', avv === 'Rentada');
        marcar('pfAvalVivFamiliar', avv === 'Familiares');
        set('pfAvalTiempo', v('avalTiempoResidencia'));

        set('pfAvalConyNombre', v('avalConyugeNombre'));
        set('pfAvalConyCel', v('avalConyugeCelular'));

        // Ingresos Aval
        set('pfAvalOcupacion', v('avalOcupacion'));
        set('pfAvalEmpresa', v('avalEmpresa'));
        set('pfAvalDirTra', v('avalDirTrabajo'));
        set('pfAvalSueldo', v('avalSueldo'));

        var acc = radio('avalComprueba');
        marcar('pfAvalCompSi', acc === 'Sí');
        marcar('pfAvalCompNo', acc === 'No');
        set('pfAvalOtros', v('avalOtrosIngresos'));
        set('pfAvalTotalIng', v('avalTotalIngresos'));

        // Gastos Aval
        set('pfAvalG1Renta', v('avalGastoRenta'));
        set('pfAvalG2Alimentos', v('avalGastoAlimentos'));
        set('pfAvalG3Servicios', v('avalGastoServicios'));
        set('pfAvalG4Transporte', v('avalGastoTransporte'));
        set('pfAvalG5Estudio', v('avalGastoEstudio'));
        set('pfAvalG6Otros', v('avalGastoOtros'));
        set('pfAvalTotalGastos', v('avalTotalGastos'));

        // Capacidad Aval
        set('pfAvalCapIngresos', v('avalCapIngresos'));
        set('pfAvalCapEgresos', v('avalCapEgresos'));
        set('pfAvalCapDiferencia', v('avalCapDiferencia'));
        set('pfAvalCapSemanal', v('avalCapSemanal'));
    }

    // ========================================
    // GENERAR PDF
    // ========================================
    function nombreArchivo() {
        var nom = (v('cliNombre') + '-' + v('cliApPaterno')).replace(/\s+/g, '-') || 'Cliente';
        return 'Solicitud-Credito-' + nom + '-' + new Date().toISOString().slice(0, 10) + '.pdf';
    }

    function generarPDF() {
        if (!window.jspdf || !window.html2canvas) {
            throw new Error('No se cargaron las librerías de PDF. Verifica tu conexión a internet.');
        }

        return html2canvas($('pdf-page'), {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
        }).then(function (canvas) {
            var pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            var pw = 210,
                ph = 297;
            var mmPorPx = pw / canvas.width;
            var imgData = canvas.toDataURL('image/jpeg', 0.95);
            var altoImgMm = canvas.height * mmPorPx;
            var heightLeft = altoImgMm;
            var position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pw, altoImgMm);
            heightLeft -= ph;

            while (heightLeft > 0) {
                position -= ph;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pw, altoImgMm);
                heightLeft -= ph;
            }

            return pdf.output('blob');
        });
    }

    // ========================================
    // DESCARGAR PDF
    // ========================================
    function descargarPDF() {
        btnDescargar.disabled = true;
        btnDescargar.textContent = '⏳ Generando…';

        generarPDF().then(function (blob) {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = nombreArchivo();
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 8000);

            mostrarAviso('✅ PDF descargado correctamente.', true);
        }).catch(function (e) {
            mostrarAviso('❌ ' + e.message, false);
        }).finally(function () {
            btnDescargar.disabled = false;
            btnDescargar.textContent = '📥 Descargar PDF';
        });
    }

    // ========================================
    // MENSAJE DE WHATSAPP
    // ========================================
    function resumenMensaje() {
        var nom = (v('cliNombre') + ' ' + v('cliApPaterno') + ' ' + v('cliApMaterno')).trim() || 'Cliente';
        var L = [];
        L.push('📄 *SOLICITUD DE CRÉDITO* (PDF adjunto)');
        L.push('');
        L.push('👤 *Cliente:* ' + nom);
        L.push('💵 *Monto:* $' + v('montoSolicitado') + ' MXN');
        L.push('📆 *Plazo:* ' + v('plazoSemanas') + ' semanas');
        L.push('🏷️ *Tipo:* ' + (radio('tipoOperacion') || '—'));
        L.push('📱 *Celular:* ' + v('cliCelPersonal'));
        L.push('📧 *Email:* ' + v('cliEmail'));
        L.push('📅 *Fecha:* ' + (v('encFecha') || new Date().toLocaleDateString('es-MX')));
        L.push('');
        L.push('📎 Se adjunta el formato completo.');
        return L.join('\n');
    }

    // ========================================
    // MOSTRAR AVISO
    // ========================================
    function mostrarAviso(html, ok) {
        aviso.innerHTML = html;
        aviso.className = ok ? 'aviso aviso-ok' : 'aviso';
        aviso.style.display = 'block';
        if (ok) {
            setTimeout(function () {
                aviso.style.display = 'none';
            }, 8000);
        }
    }
// ========================================
// ENVIAR POR WHATSAPP (VERSIÓN MEJORADA)
// ========================================
function enviarWhatsApp() {
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (!$('acepto').checked) {
        mostrarAviso('⚠️ Debes marcar la casilla de <strong>aceptación</strong> para enviar.', false);
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = '⏳ Generando PDF…';

    var texto = resumenMensaje();

    generarPDF().then(function (blob) {
        var file = new File([blob], nombreArchivo(), { type: 'application/pdf' });

        // ========================================
        // 1. INTENTAR COMPARTIR (Android/iPhone)
        // ========================================
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            return navigator.share({
                files: [file],
                title: 'Solicitud de Crédito',
                text: texto
            }).then(function () {
                mostrarAviso('✅ PDF enviado por WhatsApp correctamente.', true);
            }).catch(function (err) {
                if (err.name === 'AbortError') {
                    mostrarAviso('ℹ️ Compartir cancelado.', true);
                    return;
                }
                throw err;
            });
        }

        // ========================================
        // 2. FALLBACK: DESCARGAR + ABRIR WHATSAPP
        // ========================================
        throw new Error('share-fallback');

    }).then(function () {
        btnEnviar.disabled = false;
        btnEnviar.textContent = '📤 Enviar PDF por WhatsApp';

    }).catch(function (e) {
        // ========================================
        // 3. ERROR: MANEJO DE PERMISOS
        // ========================================
        if (e && e.message === 'share-fallback') {
            // Descargar el PDF
            generarPDF().then(function (blob) {
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = nombreArchivo();
                document.body.appendChild(a);
                a.click();
                a.remove();

                // Abrir WhatsApp con el mensaje
                var url = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(texto);
                window.open(url, '_blank');

                mostrarAviso(
                    '📎 <strong>PDF descargado</strong> y WhatsApp abierto.<br>' +
                    '📤 <strong>Adjunta el PDF</strong> en la conversación y envía.<br>' +
                    '📱 Número: <strong>+52 249 110 3620</strong>',
                    false
                );
            });

        } else if (e && e.name === 'AbortError') {
            // Usuario canceló
            mostrarAviso('ℹ️ Cancelaste el envío.', true);

        } else if (e && e.message && e.message.includes('permission')) {
            // Error de permisos
            mostrarAviso(
                '❌ <strong>Error de permisos.</strong><br>' +
                '📱 Abre WhatsApp Web y escanea el código QR desde tu celular.<br>' +
                '💻 O usa un <strong>dispositivo móvil</strong> para enviar el PDF directamente.',
                false
            );

            // Abrir WhatsApp Web como alternativa
            window.open('https://web.whatsapp.com/', '_blank');

        } else {
            mostrarAviso('❌ ' + (e && e.message ? e.message : 'No se pudo generar el PDF.'), false);
        }

        btnEnviar.disabled = false;
        btnEnviar.textContent = '📤 Enviar PDF por WhatsApp';
    });
}
   
    // ========================================
    // EVENTOS
    // ========================================
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        enviarWhatsApp();
    });

    btnDescargar.addEventListener('click', descargarPDF);

    form.addEventListener('input', function () {
        recalc();
        fillPdf();
    });

    form.addEventListener('change', function () {
        recalc();
        fillPdf();
    });

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    // Generar estructura HTML del PDF
    function generarEstructuraPDF() {
        var container = $('pdf-page');
        if (!container) return;

        container.innerHTML = `
            <div class="p-titulo">SOLICITUD DE CRÉDITO</div>

            <div class="fila">
                <span class="campo"><b>FECHA:</b> <span class="l" id="pfFecha" style="width:150px;"></span></span>
                <span class="campo"><b>EJECUTIVO:</b> <span class="l" id="pfEjecutivo"></span></span>
                <span class="campo"><b>ZONA:</b> <span class="l" id="pfZona"></span></span>
                <span class="campo"><b>PRODUCTO:</b> <span class="l" id="pfProducto"></span></span>
            </div>

            <div class="sec">Datos del cliente</div>
            <div class="fila">
                <span class="campo"><b>NOMBRE:</b> <span class="l" id="pfCliNombre"></span></span>
                <span class="campo"><b>APELLIDO PATERNO:</b> <span class="l" id="pfCliApPaterno"></span></span>
                <span class="campo"><b>APELLIDO MATERNO:</b> <span class="l" id="pfCliApMaterno"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>FECHA DE NACIMIENTO:</b> <span class="l" id="pfCliDia" style="width:30px;"></span> / <span class="l" id="pfCliMes" style="width:80px;"></span> / <span class="l" id="pfCliAnio" style="width:45px;"></span></span>
                <span class="campo"><b>SEXO:</b> M <span class="caja" id="pfCliSexoM"></span> F <span class="caja" id="pfCliSexoF"></span></span>
                <span class="campo"><b>ESTADO CIVIL:</b> <span class="l" id="pfCliEstadoCivil"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>CELULAR PERSONAL:</b> <span class="l" id="pfCliCel1"></span></span>
                <span class="campo"><b>CELULAR REFERENCIA:</b> <span class="l" id="pfCliCel2"></span></span>
                <span class="campo"><b>CURP:</b> <span class="l" id="pfCliCurp"></span></span>
            </div>

            <div class="sec">Domicilio</div>
            <div class="fila">
                <span class="campo"><b>CALLE Y NÚMERO:</b> <span class="l" id="pfCliCalle"></span></span>
                <span class="campo"><b>COLONIA:</b> <span class="l" id="pfCliColonia"></span></span>
                <span class="campo"><b>MUNICIPIO:</b> <span class="l" id="pfCliMunicipio"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>ESTADO:</b> <span class="l" id="pfCliEstado"></span></span>
                <span class="campo"><b>C.P.:</b> <span class="l" id="pfCliCp" style="width:60px;"></span></span>
                <span class="campo"><b>VIVIENDA:</b> PROPIA <span class="caja" id="pfCliVivPropia"></span> RENTADA <span class="caja" id="pfCliVivRentada"></span> FAMILIARES <span class="caja" id="pfCliVivFamiliar"></span></span>
                <span class="campo"><b>TIEMPO DE RESIDENCIA:</b> <span class="l" id="pfCliTiempo" style="width:30px;"></span> AÑOS</span>
            </div>
            <div class="fila">
                <span class="campo"><b>EMAIL:</b> <span class="l" id="pfCliEmail"></span></span>
                <span class="campo"><b>NOMBRE DE CÓNYUGE:</b> <span class="l" id="pfConyugeNombre"></span></span>
                <span class="campo"><b>CELULAR CÓNYUGE:</b> <span class="l" id="pfConyugeCel"></span></span>
            </div>

            <div class="sec">Actividad económica (ingresos) — Cliente</div>
            <div class="fila">
                <span class="campo"><b>OCUPACIÓN:</b> <span class="l" id="pfCliOcupacion"></span></span>
                <span class="campo"><b>EMPRESA:</b> <span class="l" id="pfCliEmpresa"></span></span>
                <span class="campo"><b>DIRECCIÓN:</b> <span class="l" id="pfCliDirTra"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>SUELDO MENSUAL:</b> $ <span class="li" id="pfCliSueldo"></span></span>
                <span class="campo"><b>COMPRUEBA:</b> SÍ <span class="caja" id="pfCliCompSi"></span> NO <span class="caja" id="pfCliCompNo"></span></span>
                <span class="campo"><b>OTROS INGRESOS:</b> $ <span class="li" id="pfCliOtros"></span></span>
                <span class="campo"><b>TOTAL DE INGRESOS:</b> $ <span class="li" id="pfCliTotalIng"></span></span>
            </div>

            <div class="sec">Estudios de gastos básicos (egresos)</div>
            <div class="cols2">
                <div class="col">
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>RENTA O HIPOTECA:</b> $ <span class="li" id="pfG1Renta"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>ALIMENTOS:</b> $ <span class="li" id="pfG2Alimentos"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>SERVICIOS:</b> $ <span class="li" id="pfG3Servicios"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TRANSPORTE:</b> $ <span class="li" id="pfG4Transporte"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>ESTUDIO:</b> $ <span class="li" id="pfG5Estudio"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>OTROS GASTOS:</b> $ <span class="li" id="pfG6Otros"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TOTAL DE GASTOS:</b> $ <span class="li" id="pfTotalGastos"></span></span></div>
                </div>
                <div class="col">
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TOTAL DE INGRESOS POR MES:</b> $ <span class="li" id="pfCapIngresos"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TOTAL DE EGRESOS POR MES:</b> $ <span class="li" id="pfCapEgresos"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>DIFERENCIA (CAPACIDAD):</b> $ <span class="li" id="pfCapDiferencia"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>CAPACIDAD DE PAGO SEMANAL (÷4):</b> $ <span class="li" id="pfCapSemanal"></span></span></div>
                </div>
            </div>

            <div class="fila">
                <span class="campo"><b>MONTO SOLICITADO:</b> $ <span class="li" id="pfMonto"></span></span>
                <span class="campo"><b>PLAZO ACORDADO:</b> <span class="l" id="pfPlazo" style="width:40px;"></span> SEMANAS</span>
                <span class="campo"><b>CLIENTE NUEVO:</b> <span class="caja" id="pfCliNuevo"></span> &nbsp;&nbsp; <b>RENOVACIÓN:</b> <span class="caja" id="pfRenovacion"></span></span>
            </div>

            <div class="sec">Datos del aval</div>
            <div class="fila">
                <span class="campo"><b>NOMBRE(S):</b> <span class="l" id="pfAvalNombre"></span></span>
                <span class="campo"><b>APELLIDO PATERNO:</b> <span class="l" id="pfAvalApPaterno"></span></span>
                <span class="campo"><b>APELLIDO MATERNO:</b> <span class="l" id="pfAvalApMaterno"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>FECHA DE NACIMIENTO:</b> <span class="l" id="pfAvalDia" style="width:30px;"></span> / <span class="l" id="pfAvalMes" style="width:80px;"></span> / <span class="l" id="pfAvalAnio" style="width:45px;"></span></span>
                <span class="campo"><b>SEXO:</b> M <span class="caja" id="pfAvalSexoM"></span> F <span class="caja" id="pfAvalSexoF"></span></span>
                <span class="campo"><b>ESTADO CIVIL:</b> <span class="l" id="pfAvalEstadoCivil"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>CELULAR PERSONAL:</b> <span class="l" id="pfAvalCel1"></span></span>
                <span class="campo"><b>CELULAR REFERENCIA:</b> <span class="l" id="pfAvalCel2"></span></span>
                <span class="campo"><b>EMAIL:</b> <span class="l" id="pfAvalEmail"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>CALLE Y NÚMERO:</b> <span class="l" id="pfAvalCalle"></span></span>
                <span class="campo"><b>COLONIA:</b> <span class="l" id="pfAvalColonia"></span></span>
                <span class="campo"><b>MUNICIPIO:</b> <span class="l" id="pfAvalMunicipio"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>ESTADO:</b> <span class="l" id="pfAvalEstado"></span></span>
                <span class="campo"><b>C.P.:</b> <span class="l" id="pfAvalCp" style="width:60px;"></span></span>
                <span class="campo"><b>VIVIENDA:</b> PROPIA <span class="caja" id="pfAvalVivPropia"></span> RENTADA <span class="caja" id="pfAvalVivRentada"></span> FAMILIARES <span class="caja" id="pfAvalVivFamiliar"></span></span>
                <span class="campo"><b>TIEMPO DE RESIDENCIA:</b> <span class="l" id="pfAvalTiempo" style="width:30px;"></span> AÑOS</span>
            </div>
            <div class="fila">
                <span class="campo"><b>NOMBRE DE CÓNYUGE:</b> <span class="l" id="pfAvalConyNombre"></span></span>
                <span class="campo"><b>CELULAR CÓNYUGE:</b> <span class="l" id="pfAvalConyCel"></span></span>
            </div>

            <div class="sec">Actividad económica (ingresos) — Aval</div>
            <div class="fila">
                <span class="campo"><b>OCUPACIÓN:</b> <span class="l" id="pfAvalOcupacion"></span></span>
                <span class="campo"><b>EMPRESA:</b> <span class="l" id="pfAvalEmpresa"></span></span>
                <span class="campo"><b>DIRECCIÓN:</b> <span class="l" id="pfAvalDirTra"></span></span>
            </div>
            <div class="fila">
                <span class="campo"><b>SUELDO MENSUAL:</b> $ <span class="li" id="pfAvalSueldo"></span></span>
                <span class="campo"><b>COMPRUEBA:</b> SÍ <span class="caja" id="pfAvalCompSi"></span> NO <span class="caja" id="pfAvalCompNo"></span></span>
                <span class="campo"><b>OTROS INGRESOS:</b> $ <span class="li" id="pfAvalOtros"></span></span>
                <span class="campo"><b>TOTAL DE INGRESOS:</b> $ <span class="li" id="pfAvalTotalIng"></span></span>
            </div>

            <div class="sec">Egresos y capacidad — Aval</div>
            <div class="cols2">
                <div class="col">
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>RENTA O HIPOTECA:</b> $ <span class="li" id="pfAvalG1Renta"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>ALIMENTOS:</b> $ <span class="li" id="pfAvalG2Alimentos"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>SERVICIOS:</b> $ <span class="li" id="pfAvalG3Servicios"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TRANSPORTE:</b> $ <span class="li" id="pfAvalG4Transporte"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>ESTUDIO:</b> $ <span class="li" id="pfAvalG5Estudio"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>OTROS GASTOS:</b> $ <span class="li" id="pfAvalG6Otros"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TOTAL DE GASTOS:</b> $ <span class="li" id="pfAvalTotalGastos"></span></span></div>
                </div>
                <div class="col">
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TOTAL DE INGRESOS POR MES:</b> $ <span class="li" id="pfAvalCapIngresos"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>TOTAL DE EGRESOS POR MES:</b> $ <span class="li" id="pfAvalCapEgresos"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>DIFERENCIA (CAPACIDAD):</b> $ <span class="li" id="pfAvalCapDiferencia"></span></span></div>
                    <div class="fila"><span class="campo" style="flex:1 1 100%;"><b>CAPACIDAD DE PAGO SEMANAL (÷4):</b> $ <span class="li" id="pfAvalCapSemanal"></span></span></div>
                </div>
            </div>

            <div class="firma">
                <div class="f"><div class="li"></div><b>FIRMA DEL CLIENTE</b></div>
                <div class="f"><div class="li"></div><b>FIRMA DEL AVAL</b></div>
            </div>
        `;
    }

    // Inicializar
    generarEstructuraPDF();
    recalc();
    fillPdf();

})();
