export function formatMilliLitres(milliLitres:number ) {
if(milliLitres >= 1000) {
   const liters = milliLitres / 1000;
   // Use toFixed() with optional parameter to avoid trailing zeroes
   const formattedLiters = liters.toFixed(
     Math.max(0, -Math.floor(Math.log10(liters))),
   );
   return `${formattedLiters} Liter`;
}
    return `${milliLitres.toFixed(2)} mL`;
}

export function formatKenyaShillings(shillings:number) {
    return `${shillings.toFixed(2)} Ksh`;
}

