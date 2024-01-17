<!-- cuanto tienes "setup" en tu script, estas usando Composition API -->
<!-- cuanto NO tienes "setup" en tu script, estas usando Options API (deberas agregar un poco de codigo extra: export...) -->
<script setup>
import {
    ref,
    computed,
    watch,
} from "vue"; /* importamos ref o reactive para usar el state en vue js */
import Header from "./components/Header.vue";
import Button from "./components/Button.vue";
import { calcularTotalaPagar, formatearDinero } from "./helpers";
/* function handleChange(e) {
    // console.log(e.target.value);
    // ref
    cantidad.value = +e.target.value;

    // reactive
    // state.cantidad = +e.target.value;
} */

// este es mi state en forma de ref
const cantidad = ref(10000);
// console.log(cantidad.value);
const meses = ref(6);
const total = ref(0);
const pagoMensual = computed(() => {
    return total.value / meses.value;
});

const MIN = 0;
const MAX = 20000;
const STEP = 100;

function handleDecremento() {
    const valor = cantidad.value - STEP;
    if (valor < 0) {
        alert("La cantidad no puede ser menor a 0");
        return;
    }
    cantidad.value = valor;
}
function handleIncremento() {
    const valor = cantidad.value + STEP;
    if (valor > 20000) {
        alert("La cantidad no puede ser mayor a 20000");
        return;
    }
    cantidad.value = valor;
}

// observamos el cambio de cantidad y meses para ejecutar las variables
watch([cantidad, meses], () => {
    total.value = calcularTotalaPagar(cantidad.value, meses.value);
});

// este es mi state en forma de reactive
/* const state = reactive({
    cantidad: 0,
}); */
// console.log(state.cantidad);
</script>

<template>
    <!-- ! en esta parte, es decir, en el template... "cantidad" ya se muestra como un valor, por lo que no es necesario hacer "cantidad.value" -->
    <div class="my-20 max-w-lg mx-auto bg-white shadow p-10">
        <Header />
        <div class="flex justify-between mt-10">
            <!-- comillas simples dentro de las dobles para pasarlo como string -->
            <!--
                . cada que veas 2 puntos dentro de un componente... son props.
                . si vez un @ al inicio, eso significa que es un evento personalizado
            -->
            <Button :operador="'-'" @fn="handleDecremento" />
            <Button :operador="'+'" @fn="handleIncremento" />
        </div>
        <div class="my-5">
            <!-- colocandole 2 puntos al atributo lo conviertes en un atributo dinamico, cuyo valor puede cambiar... ademas puedes colocarle una variable o estado -->
            <input
                type="range"
                class="w-full bg-gray-200 accent-lime-500 hover:accent-lime-600"
                :min="MIN"
                :max="MAX"
                :step="STEP"
                v-model.number="cantidad"
            />
            <!-- en vez de "@input" también puede ser "vue-on:input" -->
            <!-- "input" es más dinámico que "change" -->

            <!-- * v-model es el reemplazo de:
                    :value="cantidad"
                    @input="handleChange"
                y de la funcion handleChange... cantidad.value = e.target.value -->

            <!-- así imprimes una variable en vue js -->
            <p
                class="text-6xl text-indigo-600 font-extrabold text-center my-10"
            >
                {{ formatearDinero(cantidad) }}
            </p>
            <!-- otra forma de imprimir una variable en vue js -->
            <!-- <p v-text="`$ ${cantidad}`"></p> -->

            <h2 class="text-2xl font-extrabold text-gray-500 text-center">
                Elige un <span class="text-indigo-600">plazo</span> a pagar
            </h2>
            <!-- v-model en este caso ya se encarga de enlazar la propiedad "meses" de la instancia Vue al valor seleccionado del menu desplegable -->
            <select
                class="w-full p-2 bg-white border border-gray-300 rounded-lg text-center text-xl font-bold text-gray-500 mt-5"
                v-model.number="meses"
            >
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
            </select>
            <div v-if="total > 0" class="my-5 space-y-3 bg-gray-50 p-5">
                <h2 class="text-2xl font-extrabold text-gray-500 text-center">
                    Resumen de <span class="text-indigo-600">pagos</span>
                </h2>
                <p class="text-xl text-gray-500 text-center font-bold">
                    {{ meses }} Meses
                </p>
                <p class="text-xl text-gray-500 text-center font-bold">
                    Total a pagar:
                    {{ formatearDinero(total) }}
                </p>
                <p class="text-xl text-gray-500 text-center font-bold">
                    Mensuales: {{ formatearDinero(pagoMensual) }}
                </p>
            </div>
            <p v-else class="text-xl text-gray-500 text-center font-bold mt-5">
                Selecciona una cantidad y plazo a pagar
            </p>
        </div>
    </div>
</template>
