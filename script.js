/* ============================================================
   SOLICITUD DE CRÉDITO — LÓGICA (Parte 3 de 3)
   - Cálculos automáticos de ingresos / egresos / capacidad
   - Render del documento en vivo (formato carta)
   - Exportación a PDF (tamaño carta) y envío por WhatsApp
   ============================================================ */
(function () {
  'use strict';

  var NUMERO = '522491103620';   // +52 249 110 3620, sin '+'

  /* ---------- CÁLCULOS AUTOMÁTICOS ---------- */
  function recalc() {
    var cliIng = num('cliSueldo') + num('cliOtrosIngresos');
    $('cliTotalIngresos').value = fmt(cliIng);
    var cliGas = num('cliGastoRenta') + num('cliGastoAlimentos') +
                 num('cliGastoServicios') + num('cliGastoTransporte') +
                 num('cliGastoEstudio') + num('cliGastoOtros');
    $('cliTotalGastos').value = fmt(cliGas);
    $('capDiferencia').value = fmt(cliIng - cliGas);
    $('capSemanal').value = fmt((cliIng - cliGas) / 4);
    /* …mismos cálculos para el aval… */
  }

  /* ---------- GENERACIÓN DEL PDF — TAMAÑO CARTA ---------- */
  function generarPDF() {
    return html2canvas($('pdf-page'), { scale: 2, backgroundColor: '#ffffff', useCORS: true })
      .then(function (canvas) {
        var pdf = new jspdf.jsPDF('p', 'mm', 'letter');   // 215.9 × 279.4 mm = CARTA
        var pw = 215.9, ph = 279.4;
        var mmPorPx = pw / canvas.width;
        var imgData = canvas.toDataURL('image/jpeg', 0.95);
        var altoImgMm = canvas.height * mmPorPx;
        var heightLeft = altoImgMm, position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, pw, altoImgMm);
        heightLeft -= ph;
        while (heightLeft > 0) {       // si excede la hoja, divide en varias páginas
          position -= ph;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pw, altoImgMm);
          heightLeft -= ph;
        }
        return pdf.output('blob');
      });
  }

  /* ---------- ENVÍO POR WHATSAPP AL +52 249 110 3620 ---------- */
  function enviarWhatsApp() {
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!$('acepto').checked) { /* aviso de aceptación */ return; }
    btnEnviar.disabled = true;
    var texto = resumenMensaje();
    generarPDF().then(function (blob) {
      var file = new File([blob], nombreArchivo(), { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // 📱 Celular/tablet: menú de compartir del sistema → eliges WhatsApp → adjunta el PDF
        return navigator.share({ files: [file], title: 'Solicitud de Crédito', text: texto });
      }
      throw new Error('share-fallback');
    }).catch(function (e) {
      if (e && e.message === 'share-fallback') {
        // 💻 Escritorio: descarga el PDF + abre WhatsApp Web redactado
        descargarPDF();
        window.open('https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(texto), '_blank');
      }
    }).finally(function () { btnEnviar.disabled = false; });
  }
})();
