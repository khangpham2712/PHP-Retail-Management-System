function descendingComparator(a, b, orderBy) {
   if ( orderBy !== null){
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    
    } else{
        if (b.id< a.id) {
            return -1;
        }
        if (b.id > a.id) {
            return 1;
        }
        return 0;
    }
    return 0;
}
// function descendingComparator(a, b, orderBy) {
//     if (b.id< a.id) {
//         return -1;
//     }
//     if (b.id > a.id) {
//         return 1;
//     }
//     return 0;
// }
export function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
export  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


export function calculateTotalQuantity ( cartList ) {
    var value= 0
    cartList.map(item => value +=Number(item.quantity) )
    return value
  }
  export function calculateTotalReturnQuantity ( cartList ) {
    var value= 0
    cartList.map(item => value +=item.returnQuantity )
    return value
  }

  