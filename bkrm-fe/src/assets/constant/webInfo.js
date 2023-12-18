const webInfo = {
    webAddress :'lyquochai',
    status:'inactive',
    orderManagement:{
      branchOption:'default',
      branchDefault: null,
      orderWhenOutOfSctock:false,

    },
    // mainColor: {  r: '250', g: '140', b: '22',  a: '1', hex:'#fa8c16'} ,
    mainColor: {  r: '242', g: '165', b: '174',  a: '1', hex:'#f2a5ae'},  
    bgColor:{r: '255', g: '255', b: '255',  a: '1',hex:'#ffffff'},
    navBar:{
      buttonLogin: "1" ,  // 0: nut, 1:icon
      buttonCart:"0" , //0: special, 1: normal
      navColor : "1", //0:white, 1- maincolor
      textNav : ["1",17, 600],  //0-left 1-right //color: black-white-grey-maincolor, size: small - large(16):,  bold:no() -yes (600)
    },
    listProduct:{
      priceStyle :["0", 18, 600],//0-left 1-right //color: normal-maincolor , size: small - large(16), bold:no() -yes (600)
      nameStyle: ["0", 19, 300],//0-left 1-right //color: normal-maincolor , size: small - large(16), bold:no() -yes (600), maxNumberOFline: 1-2
      btnStyle:["0", "0"], //0-left 1-right //haveBtn: yes-no, style:circle - box
      isBox:false,
      isMargin:true,
      border:true,
      alignCenter:false,
      marginContainer:0,
      boxDistance:1,
      // marginContainer:10,
      // boxDistance:2,
    } ,
    cart:{
      summaryPosition:'right',
      header:"show"
    },
    other:{
      status:false,
      detail:{
        id:"f9yq8g",
        rows:[],
        version:1
      },
    },
    detailPage:{
      priceStyle: ["0", 24, 700],
      nameStyle: ["0", 34, 700],
    },
    mainPage:{
      bestSeller:{
        status:true,
        numberTop:10
      },
      newArrival:{
        status:true,
        numberTop:10
      },
      discount:true
    },
    footer:{
      color:'0',
      bgColor:{ r: "0", g: "0", b: "0", a: "1", hex: "#000000" },
      btnType:'0',
      showSocial:true

    }
}
export default webInfo