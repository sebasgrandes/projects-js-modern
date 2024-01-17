// agregar el import react no es necesario en las nuevas versiones de react
function Header() {
    // no olvides colocar lo que imprimirás dentro de tu return
    return (
        <h1 className="text-4xl font-extrabold text-gray-500 text-center">
            ¿Cuánto <span className="text-indigo-600"> dinero</span> necesitas?
        </h1>
    );
}

export default Header;
