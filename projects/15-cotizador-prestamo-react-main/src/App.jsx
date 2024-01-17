import {
    useState,
    useEffect,
} from "react"; /* importamos el hook "useState" de la biblioteca de react para poder usar los estados */

import Header from "./components/Header.jsx";
import Button from "./components/Button.jsx";

import {
    formatearDinero,
    calculoPrestamo,
} from "./helpers"; /* como importaremos index.js no es necesario colocarlo... basta con colocar la carpeta */

function App() {
    // en esta parte creas tu codigo de js, no en el return

    // * el state lo declararás unicamente en las partes que se pueden modificar a futuro en tu aplicación (como la cantidad que muestras en tu pantalla, o un carrito, etc.)...
    // hacemos destructuring del array que devuelve useState()
    // el 1er valor es el state (la variable de estado) y el 2do valor es la funcion que modifica UNICAMENTE dicho state (funcion setter o actualizadora). si quieres modificar el 1ero, SOLO debes usar el 2do, no hacerlo de otra forma
    // la convencion de nombre es: [proyectozxzxzxzx, setProyectozxzxzxzx]
    const [cantidad, setCantidad] =
        useState(
            10000
        ); /* el 10000 es el valor con el que inicia la variable de estado "cantidad" */

    const [meses, setMeses] = useState(6);
    const [total, setTotal] = useState(0);
    const [pago, setPago] = useState(0);

    // este use effect se ejecuta cada que las variables del arreglo de dependencia (lo de []) cambian (o sea cada que cantidad o meses se actualizan)
    useEffect(() => {
        // el useEffect al inicio se ejecuta por sí solo al menos 1 vez (cuando el componente está listo)... y creo que por eso justamente se muestra al inicio el "total" (en pantalla) como 16500 porque se ejecutó este useEffect
        console.log("Componente listo... o cantidad cambió... o meses cambió");
        const resultadoTotalaPagar = calculoPrestamo(cantidad, meses);
        setTotal(resultadoTotalaPagar);
        // el siguiente codigo es una mala practica... por lo que asegurate de no incluir en la lista de dependencias una variable (por ejemplo total) que actualizas (por ejemplo setTotal) dentro del useEffect
        // // setPago(total / meses);
    }, [cantidad, meses]);

    // si le agregas demasiadas variables a tu arreglo de dependencias... puede salirse de las manos facilmente... por esto y mas cosas se recomienda separarlo. ademas esto constituye una buena practica
    useEffect(() => {
        setPago(total / meses);
    }, [total]);

    // también puedes crear constantes que no se modifiquen
    const MIN = 0;
    const MAX = 20000;
    const STEP = 100;

    // puedes ver tus hooks como el state y su valor inicial en el clg, pero una mejor forma de verlo es através de la extension (react developer tools) instalada en chrome
    // console.log(setCantidad(20000));

    // agregar "handle" al inicio es una convencion en react
    function handleChange(e) {
        // el "+" significa que es un numero (similar al parseInt y Number)
        // este codigo rompe con el state, no se debe hacer -> // //cantidad = +e.target.value;
        // e.target.value es el valor definido EN EL DOM en el momento de producirse el evento. no necesariamente el valor que coloqué de value="500"
        setCantidad(
            +e.target.value
        ); /* así modificas la variable de estado "cantidad" */
    }

    function handleDecremento() {
        const valor = cantidad - STEP;
        if (valor < MIN) {
            alert("La cantidad mínima es 0");
            return;
        }
        setCantidad(valor);
    }
    function handleIncremento() {
        const valor = cantidad + STEP;
        if (valor > MAX) {
            alert("La cantidad máxima es 20000");
            return;
        }
        setCantidad(valor);
    }

    return (
        // lo que esta dentro del return se reserva solo para la vista (limitate a eso, no agregues funciones o declares variables dentro del return)
        <div className="my-20 max-w-lg mx-auto bg-white shadow p-10">
            {/* así renderizamos este tipo de componentes que no tienen hijos */}
            {/* regla de react: si una etiqueta html solamente es de apertura (como los inputs o imagenes)?, tienes que añadirle una "/" de cierre al final */}
            <Header />
            <input
                type="range"
                className="w-full h-6 bg-gray-200 accent-lime-500 hover:accent-lime-600"
                min={MIN}
                max={MAX}
                step={STEP}
                value={cantidad} // * ok -> explicado en la ultima parte de 02 onChange y render.mkd
                onChange={handleChange}
                // el evento onChange se activa (ejecutando la funcion handleChange) cada que cambiamos el valor del input
                // en jsx los corchetes se usan para insertar expresiones de js en el codigo
                // onChange es como si usaramos "document.querySelector(".bg-gray-200").addEventListener("change", handleChange)" pero de forma simplificada
            />
            <div className="flex justify-between my-6">
                {/* el signo y fn se pasan al "props" */}
                <Button signo="-" fn={handleDecremento} />
                <Button signo="+" fn={handleIncremento} />
            </div>

            <p className="my-10 text-5xl text-indigo-600 font-extrabold text-center">
                {formatearDinero(cantidad)}
            </p>
            {/* también puedes colocar tus funciones de esa manera (e => ...)
            ! la principal utilidad de colocar value={meses} en mi select es: que React controle qué opción se está mostrando como seleccionada basada en el valor del estado. en resumen este value sirve paramostrar en el navegador que opcion debe mostrarse como seleccionada... y la cual varia dependiendo de la variablede estado "meses" (que inicialmente es 6, pero que en cada onchange cambia... la variable y por tanto lo que se muestra gracias al value=)
            recuerda que e.target.value toma el valor de la opción seleccionada por el usuario EN EL DOM.
            */}
            <select
                className="mt-5 w-full p-2 bg-white border border-gray-300 rounded-lg text-center text-xl font-bold text-gray-500"
                value={meses}
                onChange={(e) => setMeses(+e.target.value)}
            >
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
            </select>
            <div className="my-5 space-y-3 bg-gray-50 p-5">
                <h2 className="text-2xl font-extrabold text-gray-500 text-center">
                    Resumen de <span className="text-indigo-600">pagos</span>
                </h2>
                <p className="text-xl text-gray-600 text-center font-bold">
                    {meses} Meses
                </p>
                <p className="text-xl text-gray-600 text-center font-bold">
                    {formatearDinero(total)} Total a pagar
                </p>
                <p className="text-xl text-gray-600 text-center font-bold">
                    {formatearDinero(pago)} Mensuales
                </p>
            </div>
        </div>
    );
}

export default App;
