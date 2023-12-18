import moment from 'moment';

// string
export const convertDateToString = (date) => {
    return moment.unix(date.getTime() / 1000).format('YYYY-MM-DD HH:mm:ss',  { trim: false })
}

export function removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
}

//đọc só

export class Docso
{
    doc1so(so)
    {
        var arr_chuhangdonvi=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
        var resualt='';
            resualt=arr_chuhangdonvi[so];
        return resualt;
    }
    doc2so(so)
    {
        so=so.replace(' ','');
        var arr_chubinhthuong=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
        var arr_chuhangdonvi=['mươi','mốt','hai','ba','bốn','lăm','sáu','bảy','tám','chín'];
        var arr_chuhangchuc=['','mười','hai mươi','ba mươi','bốn mươi','năm mươi','sáu mươi','bảy mươi','tám mươi','chín mươi'];
        var resualt='';
        var sohangchuc=so.substr(0,1);
        var sohangdonvi=so.substr(1,1);
        resualt+=arr_chuhangchuc[sohangchuc];
        if(sohangchuc==1&&sohangdonvi==1)
            resualt+=' '+arr_chubinhthuong[sohangdonvi];
        else if(sohangchuc==1&&sohangdonvi>1)
            resualt+=' '+arr_chuhangdonvi[sohangdonvi];
        else if(sohangchuc>1&&sohangdonvi>0)
            resualt+=' '+arr_chuhangdonvi[sohangdonvi];
        
        return resualt;
    }
    doc3so(so)
    {
        var resualt='';
        var arr_chubinhthuong=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
        var sohangtram=so.substr(0,1);
        var sohangchuc=so.substr(1,1);
        var sohangdonvi=so.substr(2,1);
        resualt=arr_chubinhthuong[sohangtram]+' trăm';
        if(sohangchuc==0&&sohangdonvi!=0)
            resualt+=' linh '+arr_chubinhthuong[sohangdonvi];
        else if(sohangchuc!=0)
            resualt+=' '+this.doc2so(sohangchuc+' '+sohangdonvi);
        return resualt;
    }
    
    docsonguyen(so)
    {
        
        var result='';
		if(so!=undefined)
        {
            //alert(so);
            var arr_So=[{ty:''},{trieu:''},{nghin:''},{tram:''}];
            var sochuso=so.length;
            for(var i=(sochuso-1);i>=0;i--)
            {
                
    			if((sochuso-i)<=3)
                {
                    if(arr_So['tram']!=undefined)
    					arr_So['tram']=so.substr(i,1)+arr_So['tram'];
    				else arr_So['tram']=so.substr(i,1);
    				
                }
                else if((sochuso-i)>3&&(sochuso-i)<=6)
                {
                    if(arr_So['nghin']!=undefined)
    					arr_So['nghin']=so.substr(i,1)+arr_So['nghin'];
    				else arr_So['nghin']=so.substr(i,1);
                }
                else if((sochuso-i)>6&&(sochuso-i)<=9)
                {
                    if(arr_So['trieu']!=undefined)
    					arr_So['trieu']=so.substr(i,1)+arr_So['trieu'];
    				else arr_So['trieu']=so.substr(i,1);
                }
    			else 
    			{
                    if(arr_So.ty!=undefined)
    					arr_So.ty=so.substr(i,1)+arr_So.ty;
    				else arr_So.ty=so.substr(i,1);
                }
    			//console.log(arr_So);
            }
    		
            if(arr_So['ty']>0)
                result+=this.doc(arr_So['ty'])+' tỷ';
            if(arr_So['trieu']>0)
            {
                if(arr_So['trieu'].length>=3||arr_So['ty']>0)
                    result+=' '+this.doc3so(arr_So['trieu'])+' triệu';
                else if(arr_So['trieu'].length>=2)
                    result+=' '+this.doc2so(arr_So['trieu'])+' triệu';
                else result+=' '+this.doc1so(arr_So['trieu'])+' triệu';
            }
            if(arr_So['nghin']>0)
            {
                if(arr_So['nghin'].length>=3||arr_So['trieu']>0)
                    result+=' '+this.doc3so(arr_So['nghin'])+' nghìn';
                else if(arr_So['nghin'].length>=2)
                    result+=' '+this.doc2so(arr_So['nghin'])+' nghìn';
                else result+=' '+this.doc1so(arr_So['nghin'])+' nghìn';
            }
            if(arr_So['tram']>0)
            {
               if(arr_So['tram'].length>=3||arr_So['nghin']>0)
                    result+=' '+this.doc3so(arr_So['tram']);
               else if(arr_So['tram'].length>=2)
                    result+=' '+this.doc2so(arr_So['tram']);
               else result+=' '+this.doc1so(arr_So['tram']);
            }
        }
        return result;
    }
    
    doc(so)
    {
        var kytuthapphan=",";
        var result='';
        if(so!=undefined)
        {
            so=" "+so+" ";
            so=so.trim();
            var cautrucso=so.split(kytuthapphan);
            if(cautrucso[0]!=undefined)
            {
                result+=this.docsonguyen(cautrucso[0]);
            }
            if(cautrucso[1]!=undefined)
            {
                //alert(this.docsonguyen(cautrucso[1]));
                result+=' phẩy '+ this.docsonguyen(cautrucso[1]);
            }
        }
        
        return capitalizeFirstLetter(result);
        // return result.charAt(0).toUpperCase() + result.slice(1);
    }
}
function capitalizeFirstLetter(result) {
  return result.charAt(1).toUpperCase() + result.slice(2);
}


//get All product in category parent

 // // find all category child
 const findRoot = (curCatId, category) => {
    // if (category && (curCatId === category.id)) {
    if (category && (curCatId === category.uuid)) {
      return category;
    } else {
      for(let subCat of category.children) {
        const subRoot = findRoot(curCatId, subCat);
        if (subRoot) return subRoot
      }
    }
  }

  const checkSubcategory = (productCatId, curCatId, subCats) => {
    if (productCatId === curCatId) {
      return true
    };

    for (let i = 0; i < subCats.length; i++) {
      if (checkSubcategory(productCatId, subCats[i].uuid, subCats[i].children)) {
        return true;
      }
    }
    return false;
  }
  const checkProduct = (productCatId, catId,categories) => {
    const root = findRoot(catId, {children: categories});
    if (root) return checkSubcategory(productCatId, catId, root.children);
    else return false;
  }
export const getAllProductInCategoryParent = (products,categories,categoryId)=>{
    console.log("HIHI products",products)
    console.log("HIHI categories",categories)
    console.log("HIHI categoryId",categoryId)
    if(categories){
        return  products.filter(product => checkProduct(product.category.uuid, Number(categoryId),categories) ) 

    }

}


export const currentDate = () => {
    let d = moment.now() / 1000;
    let importTime = moment
        .unix(d)
        .format("YYYY-MM-DD HH:mm:ss", { trim: false });

    return importTime;
}

export const isLessDate = (strDate1, strDate2) => {
    var d1 = Date.parse(strDate1);
    var d2 = Date.parse(strDate2);
    if (d1 < d2) {
        return true;
    }
}

export const addDate = (strDate, days) => {
    var date = Date.parse(strDate);
    date.setDate(date.getDate() + days);
    return date.toString();
}

export const getColorBatch = (batch, period) => {
    if (batch.expiry_date) {
        if (isLessDate(batch.expiry_date, (new Date()).toDateString())) {
            return {color: "red", status: "Hết hạn"}
        } else {
            if (period) {
                if (isLessDate(batch.expiry_date, addDate( (new Date()).toDateString(), -period))) {
                    return {color: "yellow", status: "Sắp hết hạn"}
                } else {
                    return {color: "blue", status: "Còn hạn"}
                }
            }
            
        }
    }
    return {color: "blue", status: "Còn hạn"}
}