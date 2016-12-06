var fs=require("fs");
var rl=require('readline');

var li=rl.createInterface({
  input:fs.createReadStream('../csv/Indicators.csv'),
});
var asianCountry=["Arab World","Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam","Cambodia","China","Cyprus","Egypt Arab Rep.","India","Indonesia","Iran Islamic Rep.","Iraq","Israel","Japan","Jordan","Kazakhstan","Korea Dem. Rep.","Korea Rep.","Kuwait","Kyrgyz Republic","Lao PDR","Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar","Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan",
"Thailand","Timor-Leste","Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen Rep."];
var arr=[];
var counter=true;
var cn,ind,yr,vl;
function process(line)
{
  var line=line.split(new RegExp(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
  if(counter==true)
  {
    cn=line.indexOf('CountryName');
    ind=line.indexOf('IndicatorName');
    yr=line.indexOf('Year');
    vl=line.indexOf('Value');
    counter=false;
  }
  else
  {
    if(asianCountry.includes(line[cn]))
    {
      let obj={};
      if(line[ind]=='"Life expectancy at birth, female (years)"'||line[ind]=='"Life expectancy at birth, male (years)"')
      {
        let flag=true;
        arr.map(function(ele,i){
          if(ele.year==line[yr])
          {

            if(line[ind]=='"Life expectancy at birth, female (years)"'){
              ele['female_birth']+=parseFloat(line[vl]);
            }
            else if(line[ind]=='"Life expectancy at birth, male (years)"'){
              ele['male_birth']+=parseFloat(line[vl]);
            }
            flag=false;
          }

        })
        if(flag==true)
        {
          obj={
            year:line[yr]
          }
          if(line[ind]=='"Life expectancy at birth, female (years)"'){
            obj['female_birth']=parseFloat(line[vl]);
            obj['male_birth']=0;
          }
          else if(line[ind]=='"Life expectancy at birth, male (years)"'){
            obj['male_birth']=parseFloat(line[vl]);
            obj['female_birth']=0;
          }
          arr.push(obj)
        }
      }

    }
  }
}

li.on('line', function (line) {

  process(line);

}).on('close',function(){
  console.log(arr);
  fs.writeFile('../json/asian.json',JSON.stringify(arr));
});