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
    vl=line.indexOf('Value');
    counter=false;

  }
  else
  {
  	if(line[ind]=='"Life expectancy at birth, total (years)"')
  	{
  		var flag=true;
  		arr.map(function(ele,i){
  				if(ele.country===line[cn])
  				{
  					ele.value+=eval(line[vl]);
  					flag=false;
  				}
  		})
  		if(flag===true)
  		{
  			let obj={
  				country:line[cn],
  				value:eval(line[vl])
  			}
  			arr.push(obj);
  		}
  	}
  }

}
li.on('line', function (line) 
{
  process(line);
}).on('close',function(){
	var sorted=arr.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value);
});
  console.log(sorted.slice(0,5));
  fs.writeFile('../json/topcountries.json',JSON.stringify(sorted.slice(0,5)));
});