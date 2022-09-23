let WebAPI_Helper = async (method, method_name, body) => {

  if (method === 'get') {
    const res = await fetch('api/' + method_name, {
      'credential': 'include',
      Method: 'get',
      Headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": "true"
      }
    })

    const data = await res.json()
    return data
  }

  else { // POST

     await fetch('api/' + method_name, {
      'credential': 'include',
      method: 'POST',
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify(body),
    })

    //await res.json()
   // return data
  }

}

let Process_Country = (region) => {
  switch (region) {
    case "SG":
    case "HK":
    case "AU":
    case "NZ":
    case "CN":
    case "KR":
    case "TH":
    case "PH":
    case "ID":
    case "NP":
    case "US":
    case "CA":
    case "IN":
    case "MM":
    case "VN":
    case "AE":
    case "MY":
    case "FI":
    case "AT":
    case "DE":
    case "CH":
    case "FR":
    case "GB":
    case "IT":
    case "SK":
    case "NL":
    case "PT":
    case "DK":
    case "HR":
    case "RO":
    case "SE":
    case "NO":
    case "IL":
    case "NA":
    case "RU":
    case "ES":
    case "ZA":
    case "CZ":
    case "BE":
    case "PL":
    case "LT":
    case "QA":
    case "UA":
    case "PK":
    case "EG":
    case "LB":
    case "TR":
    case "BY":
    case "MK":
    case "IE":
    case "NG":
    case "SA":
    case "SI":
    case "TN":
    case "GH":
    case "GR":
    case "JP":
      return "<img src='../img/regions/" + region + ".png' :title=${region}></img>";
    default:
      return "<label style='color:white;background-color:#2196F3'>" + region + "</label>";
  }

}

// let Sleep = (milliseconds) => {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// }

let Sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

let SetAppStyleMode = (appmode) => {
  SaveSettingToLocalStorage("AppMode", appmode)
}

let GetAppStyleMode = () => {

  const appmode = GetSettingFromLocalStorage("AppMode")
  if (appmode === null || appmode === undefined) return "DARK"
  return appmode.toUpperCase()
}


let Days_Diff = (start) => {
  const now = new Date();
  const start_time = new Date(start);
  const difference = now.getTime() - start_time.getTime();
  return Math.abs(Math.ceil(difference / (1000 * 3600 * 24)));
}

let DataLabelFormatter =(value,ctx) => {
  let sum = 0;
  let dataArr = ctx.chart.data.datasets[0].data;

  dataArr.map(data => {
      sum += data;
  });

  let percentage = (value*100 / sum).toFixed(0);
 
  return  percentage >=8 ? percentage+"%":"";    

}

let GetSettingFromLocalStorage =(setting_name) =>{

  return window.localStorage.getItem(setting_name); 

  

}

let SaveSettingToLocalStorage =(setting_name,value) => {

  window.localStorage.setItem(setting_name, value);

}

let GetSettingFromSessionStorage =(setting_name) =>{

  return window.sessionStorage.getItem(setting_name); 

  

}

let SaveSettingToSessionStorage =(setting_name,value) => {

  window.sessionStorage.setItem(setting_name, value);

}

let ClearSettingFromLocalStorage=()=> {
  window.localStorage.clear();
}

//Shuffle the array so that we will get top items randomly
let  Shuffle = (backgroundColor_Array)=> {
  for (let i = backgroundColor_Array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [backgroundColor_Array[i], backgroundColor_Array[j]] = [
      backgroundColor_Array[j],
      backgroundColor_Array[i],
    ];
  }
  return backgroundColor_Array;
}
   
export { 
  WebAPI_Helper, Process_Country, Sleep, SetAppStyleMode, GetAppStyleMode, Days_Diff ,
  DataLabelFormatter,GetSettingFromLocalStorage,GetSettingFromSessionStorage,SaveSettingToSessionStorage,
  SaveSettingToLocalStorage,ClearSettingFromLocalStorage,Shuffle
}
