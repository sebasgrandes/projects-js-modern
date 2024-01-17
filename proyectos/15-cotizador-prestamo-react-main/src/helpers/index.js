// en este caso solo será un archivo con funcione sunicamente... no un componente de react con jsx
// 2 ventajas al crear un archivo de funciones: 1. no vas a cargar tanto tu componente y tendras un mejor orden. 2. podras usarlo en diferentes lugares sin necesidad de pasarlo por props
const formatearDinero = (valor) => {
    // Intl es una api de js
    const formater = new Intl.NumberFormat("en-US", {
        currency: "USD",
    });
    return formater.format(valor);
};

const calculoPrestamo = (cantidad, plazo) => {
    // mientrasmayor es la cantidad, menor es el monto
    let total;

    if (cantidad < 5000) {
        total = cantidad * 1.5;
    } else if (cantidad > 5000 && cantidad < 10000) {
        total = cantidad * 1.4;
    } else if (cantidad > 10000 && cantidad < 15000) {
        total = cantidad * 1.3;
    } else {
        total = cantidad * 1.2;
    }

    if (plazo === 6) {
        total *= 1.1;
    } else if (plazo === 12) {
        total *= 1.2;
    } else {
        total *= 1.3;
    }
    return total;
};

export { formatearDinero, calculoPrestamo };
