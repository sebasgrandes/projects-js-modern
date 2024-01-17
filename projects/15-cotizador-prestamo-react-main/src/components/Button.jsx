// hago un destructuring del props... para obtener signo y fn. y asi evitar usar props.signo o props.fn...
function Button({ signo, fn }) {
    return (
        <button
            className="h-10 w-10 flex items-center justify-center font-bold text-white text-2xl bg-lime-500 rounded-full hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-lime-500"
            onClick={fn}
        >
            {signo}
        </button>
    );
}

export default Button;
