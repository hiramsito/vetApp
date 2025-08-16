/**
 * Calcula la dosis en mg*kg basada en el peso y la dosis estándar
 */
export const dosisMgKg = (peso, dosis) => {
  return peso * dosis;
};

/**
 * Calcula la fracción de tableta basada en la dosis mg*kg y el tamaño de la tableta
 */
export const fraccionTableta = (dosisMgKg, tamañoTableta) => {
  if (tamañoTableta === 0) return 0;
  return dosisMgKg / tamañoTableta;
};

/**
 * Formatea un número a dos decimales
 */
export const formatearDecimal = (numero) => {
  if (numero === null || numero === undefined || isNaN(numero)) return "0.00";
  return parseFloat(numero).toFixed(2);
};

/**
 * Valida que el peso sea un número positivo
 */
export const validarPeso = (peso) => {
  return peso && peso > 0 && !isNaN(peso);
};

/**
 * Calcula mililitros totales basado en dosis mg*kg y mg por ml
 */
export const mililitrosTotales = (dosisMgKg, mgPorMl) => {
  if (mgPorMl === 0) return 0;
  return dosisMgKg / mgPorMl;
};

/**
 * Valida si una dosis está dentro del rango permitido
 */
export const validarDosis = (dosis, dosisMin, dosisMax) => {
  if (!dosisMax) return dosis >= dosisMin;
  return dosis >= dosisMin && dosis <= dosisMax;
};

// ===== NUEVAS FUNCIONES PARA CÁLCULO DE KILOCALORÍAS =====

/**
 * Calcula kilocalorías diarias base según el tipo de mascota
 */
export const calcularKcalBase = (peso, tipoMascota) => {
  if (!validarPeso(peso)) return 0;

  if (tipoMascota === "perro") {
    return Math.pow(peso, 0.75) * 70;
  } else if (tipoMascota === "gato") {
    return peso * 50;
  }

  return 0;
};

/**
 * Obtiene los factores según el tipo de mascota y factor a evaluar
 */
export const obtenerFactores = (tipoMascota, factorEvaluar) => {
  const factores = {
    perro: {
      "adulto-esterilizado": { min: 1.4, max: 1.6 },
      "adulto-entero": { min: 1.6, max: 1.8 },
      "inactivos-obesos": { min: 1, max: 1.2 },
      "perdida-peso": { min: 1, max: 1 },
      gestacion: { min: 3, max: 3 },
      lactancia: { min: 3, max: 6 },
      crecimiento: { min: 2, max: 3 },
      "trabajo-ligero": { min: 1.2, max: 1.6 },
      "trabajo-moderado": { min: 2, max: 5 },
      "trabajo-pesado": { min: 5, max: 11 },
    },
    gato: {
      "adulto-esterilizado": { min: 1.2, max: 1.4 },
      "adulto-entero": { min: 1.4, max: 1.6 },
      "inactivos-obesos": { min: 1, max: 1 },
      "perdida-peso": { min: 0.8, max: 0.8 },
      gestacion: { min: 1.6, max: 2 },
      lactancia: { min: 2, max: 6 },
      crecimiento: { min: 2.5, max: 2.5 },
      "trabajo-ligero": { min: 0, max: 0 },
      "trabajo-moderado": { min: 0, max: 0 },
      "trabajo-pesado": { min: 0, max: 0 },
    },
  };

  return factores[tipoMascota]?.[factorEvaluar] || { min: 0, max: 0 };
};

/**
 * Determina el factor a usar para crecimiento según la edad
 */
export const determinarFactorCrecimiento = (
  tipoMascota,
  factorEvaluar,
  edad,
  factores
) => {
  if (factorEvaluar !== "crecimiento") {
    return factores;
  }

  if (tipoMascota === "perro") {
    if (edad < 4) {
      return { min: factores.max, max: factores.max }; // Usar factor máximo
    } else {
      return { min: factores.min, max: factores.min }; // Usar factor mínimo
    }
  }

  return factores; // Para gatos, siempre usar 2.5
};

/**
 * Calcula kilocalorías con factor aplicado
 */
export const calcularKcalConFactor = (kcalBase, factorSeleccionado) => {
  return kcalBase * factorSeleccionado;
};

/**
 * Calcula gramos totales al día
 */
export const calcularGramosTotales = (kcalDiarias, gramosLata, kcalLata) => {
  if (kcalLata === 0) return 0;
  return (kcalDiarias * gramosLata) / kcalLata;
};

/**
 * Calcula raciones según la frecuencia
 */
export const calcularRaciones = (gramosTotales, frecuencia) => {
  const raciones = {
    "100%": gramosTotales,
    "50%": gramosTotales / 2,
    BID: gramosTotales / 2, // 2 raciones al día
    TID: gramosTotales / 3, // 3 raciones al día
    QID: gramosTotales / 4, // 4 raciones al día
  };

  return raciones;
};
