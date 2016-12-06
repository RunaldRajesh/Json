var fs=require("fs");
var rl=require('readline');

var li=rl.createInterface({
  input:fs.createReadStream('../csv/Indicators.csv'),
});

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
    if(line[cn]=='India')
    {
      let obj={};
      if(line[ind]=='"Birth rate, crude (per 1,000 people)"'||line[ind]=='"Death rate, crude (per 1,000 people)"')
      {
        let flag=true;
        arr.map(function(ele,i){
          if(ele.year==line[yr])
          {

            if(line[ind]=='"Birth rate, crude (per 1,000 people)"'){
              ele['Birth_rate']+=parseFloat(line[vl]);
            }
            else if(line[ind]=='"Death rate, crude (per 1,000 people)"'){
              ele['Death_rate']+=parseFloat(line[vl]);
            }
            flag=false;
          }

        })
        if(flag==true)
        {
          obj={
            year:line[yr]
          }
          if(line[ind]=='"Birth rate, crude (per 1,000 people)"'){
            obj['Birth_rate']=parseFloat(line[vl]);
            obj['Death_rate']=0;
          }
          else if(line[ind]=='"Death rate, crude (per 1,000 people)"'){
            obj['Death_rate']=parseFloat(line[vl]);
            obj['Birth_rate']=0;
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
  fs.writeFile('../json/India.json',JSON.stringify(arr));

});