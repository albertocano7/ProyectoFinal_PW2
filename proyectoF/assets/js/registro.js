// ─── Registro: validación y lógica del modal ───────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Elementos del formulario ──────────────────────────────────────────────
  const form = {
    nombres:          document.getElementById('reg-nombres'),
    apellidoP:        document.getElementById('reg-apellido-p'),
    correo:           document.getElementById('reg-correo'),
    password:         document.getElementById('reg-password'),
    confirmPassword:  document.getElementById('reg-confirm-password'),
    btnRegistrar:     document.getElementById('btn-registrar'),
    alerta:           document.getElementById('reg-alerta'),
  };

  // ── Validaciones ──────────────────────────────────────────────────────────
  const validarEmail = (email) =>
    /^[^s@]+@[^s@]+.[^s@]+$/.test(email.trim());

  const validarPassword = (pwd) =>
    pwd.length >= 8;

  const limpiarErrores = () => {
    Object.values(form).forEach(el => {
      if (el && el.classList) el.classList.remove('is-invalid', 'is-valid');
    });
    if (form.alerta) {
      form.alerta.classList.add('d-none');
      form.alerta.textContent = '';
    }
  };

  const mostrarError = (mensaje) => {
    if (!form.alerta) return;
    form.alerta.textContent = mensaje;
    form.alerta.classList.remove('d-none');
  };

  const marcarCampo = (campo, valido) => {
    if (!campo) return;
    campo.classList.toggle('is-valid',   valido);
    campo.classList.toggle('is-invalid', !valido);
  };

  // ── Validación completa ───────────────────────────────────────────────────
  const validarFormulario = () => {
    limpiarErrores();
    let valido = true;

    if (!form.nombres?.value.trim()) {
      marcarCampo(form.nombres, false);
      valido = false;
    } else marcarCampo(form.nombres, true);

    if (!form.apellidoP?.value.trim()) {
      marcarCampo(form.apellidoP, false);
      valido = false;
    } else marcarCampo(form.apellidoP, true);

    if (!validarEmail(form.correo?.value || '')) {
      marcarCampo(form.correo, false);
      valido = false;
    } else marcarCampo(form.correo, true);

    if (!validarPassword(form.password?.value || '')) {
      marcarCampo(form.password, false);
      mostrarError('La contraseña debe tener mínimo 8 caracteres.');
      valido = false;
    } else marcarCampo(form.password, true);

    if (form.password?.value !== form.confirmPassword?.value) {
      marcarCampo(form.confirmPassword, false);
      mostrarError('Las contraseñas no coinciden.');
      valido = false;
    } else if (form.confirmPassword?.value) {
      marcarCampo(form.confirmPassword, true);
    }

    return valido;
  };

  // ── Envío ─────────────────────────────────────────────────────────────────
  form.btnRegistrar?.addEventListener('click', async () => {
    if (!validarFormulario()) return;

    const datos = {
      nombres:         form.nombres.value.trim(),
      primer_apellido: form.apellidoP.value.trim(),
      segundo_apellido: form.apellidoM?.value.trim() || '',
      correo:          form.correo.value.trim(),
      password:        form.password.value,
    };

    // TODO: reemplaza la URL por tu endpoint real
    try {
      const res = await fetch('/api/registro', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(datos),
      });

      if (!res.ok) {
        const err = await res.json();
        mostrarError(err.mensaje || 'Ocurrió un error. Intenta de nuevo.');
        return;
      }

      bootstrap.Modal.getInstance(
        document.getElementById('registerModal')
      )?.hide();

      alert('¡Registro exitoso! Ya puedes iniciar sesión.');

    } catch {
      mostrarError('No se pudo conectar con el servidor.');
    }
  });

  // ── Limpiar al cerrar el modal ────────────────────────────────────────────
  document.getElementById('registerModal')
    ?.addEventListener('hidden.bs.modal', () => {
      limpiarErrores();
      Object.values(form).forEach(el => {
        if (el?.tagName === 'INPUT') el.value = '';
      });
    });

});