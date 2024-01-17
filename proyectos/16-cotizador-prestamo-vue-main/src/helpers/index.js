const calcularTotalaPagar = (cantidad, meses) => {
    let total;
    if (cantidad < 5000) {
        total = cantidad * 1.5;
    } else if (cantidad >= 5000 && cantidad < 10000) {
        total = cantidad * 1.4;
    } else if (cantidad <= 10000 && cantidad > 15000) {
        total = cantidad * 1.3;
    } else {
        total = cantidad * 1.2;
    }

    if (meses === 6) {
        total *= 1.1;
    } else if (meses === 12) {
        total *= 1.2;
    } else {
        total *= 1.3;
    }

    return total;
};

// el computed property es una funcion que esta al pendiente de los cambios de tu state y realiza los cambios necesarios cuando este cambia // es una buena practica
// ! sobre todo debes colocarlo si algo se mostrará en pantalla... pero si solo cambia pues no es necesario
// al final convertirmos esto a un digamos "metodo"
const formatearDinero = (cantidad) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    return formatter.format(cantidad);
};

export { calcularTotalaPagar, formatearDinero };
