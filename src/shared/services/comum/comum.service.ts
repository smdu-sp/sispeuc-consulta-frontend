export function formataCep(value: string): string {
    const onlyDigits = value.replace(/\D/g, '');
    if (onlyDigits.length >= 8) {
        return `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5, 8)}`;
    }
    const formattedValue = onlyDigits.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    return formattedValue;
}

export function formataSetorQuadraLote(value: string): string {
    const onlyDigits = value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    // Verifica se o valor tem pelo menos 11 dígitos
    if (onlyDigits.length >= 11) {
        return `${onlyDigits.slice(0, 3)}.${onlyDigits.slice(3, 6)}.${onlyDigits.slice(6, 10)}-${onlyDigits.slice(10, 11)}`;
    }

    // Retorna o valor original sem aplicar a máscara, caso não tenha o comprimento necessário
    return onlyDigits;
}