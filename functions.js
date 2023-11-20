export const generarCombinacionAleatoria = () => {
    var caracteres = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    var combinacion = ''

    for (var i = 0; i < 7; i++) {
        var indiceAleatorio = Math.floor(Math.random() * caracteres.length)
        combinacion += caracteres.charAt(indiceAleatorio)
    }

    return combinacion
}