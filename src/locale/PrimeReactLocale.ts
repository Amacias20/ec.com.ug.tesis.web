import { locale, addLocale } from 'primereact/api';

const setupLocalization = (): (() => string) => {
    const spanishLocale = {
        firstDayOfWeek: 1,
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Limpiar',
        apply: 'Aplicar',
        cancel: 'Cancelar',
        startsWith: 'Comienza con',
        contains: 'Contiene',
        notContains: 'No contiene',
        endsWith: 'Termina en',
        equals: 'Igual',
        notEquals: 'No igual',
        noFilter: 'Sin filtro',
        lt: 'Menor que',
        lte: 'Menor o igual a',
        gt: 'Mayor que',
        gte: 'Mayor o igual a',
        is: 'Es',
        isNot: 'No es',
        before: 'Antes',
        after: 'Después',
        dateIs: 'La fecha es',
        dateIsNot: 'La fecha no es',
        dateBefore: 'La fecha es antes',
        dateAfter: 'La fecha es después',
        choose: 'Escoger',
        upload: 'Cargar',
        matchAll: 'Coincidir con todos',
        matchAny: 'Coincidir con cualquiera',
        addRule: 'Agregar regla',
        removeRule: 'Eliminar regla',
        first: 'Primero',
        last: 'Último',
        next: 'Siguiente',
        previous: 'Anterior',
        rowsPerPage: 'Filas por página',
        emptyMessage: 'No se encontraron datos',
        close: 'Cerrar',
        emptyFilterMessage: 'Sin opciones disponibles',
        emptySearchMessage: 'Sin opciones disponibles',
        emptySelectionMessage: 'Ningún artículo seleccionado',
    };

    const englishLocale = {
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        clear: 'Clear',
        apply: 'Apply',
        cancel: 'Cancel',
        startsWith: 'Starts with',
        contains: 'Contains',
        notContains: 'Not contains',
        endsWith: 'Ends with',
        equals: 'Equals',
        notEquals: 'Not equals',
        noFilter: 'No Filter',
        lt: 'Less than',
        lte: 'Less than or equal to',
        gt: 'Greater than',
        gte: 'Greater than or equal to',
        is: 'Is',
        isNot: 'Is not',
        before: 'Before',
        after: 'After',
        dateIs: 'Date is',
        dateIsNot: 'Date is not',
        dateBefore: 'Date is before',
        dateAfter: 'Date is after',
        choose: 'Choose',
        upload: 'Upload',
        matchAll: 'Match All',
        matchAny: 'Match Any',
        addRule: 'Add Rule',
        removeRule: 'Remove Rule',
        first: 'First',
        last: 'Last',
        next: 'Next',
        previous: 'Previous',
        rowsPerPage: 'Rows per page',
        emptyMessage: 'No records found',
        emptyFilterMessage: 'No results found',
        emptySearchMessage: 'No results found',
        emptySelectionMessage: 'No selected item',
        close: 'Close',
    };

    // Registrar los locales
    addLocale('es', spanishLocale);
    addLocale('en', englishLocale);

    // Función que actualiza y retorna el idioma actual
    const updateLocale = (): string => {
        const currentLang = localStorage.getItem('i18nextLng') || 'es';
        const normalizedLang = currentLang.startsWith('es') ? 'es' : 'en';
        locale(normalizedLang);
        return normalizedLang;
    };

    // Ejecutar la primera vez
    updateLocale();

    return updateLocale;
};

export default setupLocalization;