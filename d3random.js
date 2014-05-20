var rerollCount = 0;

function generateSkills(){
 //form validation
 //if (!(checkInput())){
 // return;
 //}
 
 var selectedClass = document.getElementById("class_selector").value;
 var requiredLevel = document.getElementById("level_selector").value;
 var userMaxSkills = document.getElementById("max_skills_selector").value;
 var userMaxPassives = document.getElementById("max_passives_selector").value;
 var mode = document.getElementById("mode_selector").value;
 var eligibleSkills = new Array();
 var assignedSkills = new Array();
 var eligiblePassives = new Array();
 var assignedPassives = new Array();
 var maxPassives;
 var actualMaxPassives;
 
 if (requiredLevel >= 30){
  maxPassives = 3;
 }else if (requiredLevel >= 20){
  maxPassives = 2;
 }else if (requiredLevel >= 10){
  maxPassives = 1;
 }else{
  maxPassives = 0;
 }
 
 actualMaxPassives = maxPassives;
 
 if (mode == "mode_draft"){
  maxPassives = maxPassives + 1;
  userMaxPassives = maxPassives;
  userMaxSkills = 10;
 }
 
 //grab eligible skills
 for(var i in skillArray){
  var elem = skillArray[i];
  if ((elem.d3class == selectedClass) && (elem.levelReq <= requiredLevel)){
   eligibleSkills.push(elem);
  }
 }
 
 //grab eligible passives
 for(var i in passiveArray){
  var elem = passiveArray[i];
  if ((elem.d3class == selectedClass) && (elem.levelReq <= requiredLevel)){
   eligiblePassives.push(elem);
  }
 }
 
 //choose skills
 while((eligibleSkills.length > 0) && (assignedSkills.length < userMaxSkills)){
  var randomNum = Math.floor(Math.random()*eligibleSkills.length);
  var pickedSkill = eligibleSkills[randomNum];
  var pickedName = pickedSkill.skillName;
  
  assignedSkills.push(pickedSkill);
  
  for(var i = 0; i < eligibleSkills.length; i++){
   if(eligibleSkills[i].skillName == pickedName){
    eligibleSkills.splice(i, 1);
    i--;
   }
  }
 }
 
 //fill blank skills
 while(assignedSkills.length < 6){
  assignedSkills.push(new Skill("NO_CLASS", 1, "Open Slot", "", "", ""));
 }
 
 //choose passives
 while((eligiblePassives.length > 0) && (assignedPassives.length < maxPassives) && (maxPassives > 0) && (assignedPassives.length < userMaxPassives)){
  var randomNum = Math.floor(Math.random()*eligiblePassives.length);
  var pickedPassive = eligiblePassives[randomNum];
  var pickedName = pickedPassive.skillName;
  
  assignedPassives.push(pickedPassive);
  
  eligiblePassives.splice(randomNum, 1);
 }
 
 //fill blank passives
 while(assignedPassives.length < maxPassives){
  assignedPassives.push(new Passive("NO_CLASS", 1, "Open Slot", ""));
 }
 
 var buf1 = "<a href=\"javascript:showSummary()\">Show summary (print, copy-paste, etc.)</a><br><br>";
 var buf2 = "Class: " + selectedClass + "<br>Level: " + requiredLevel + "<br>Mode: " + mode + "<br>Skills: " + userMaxSkills + "<br>Passives: " + userMaxPassives + "<br><br>";
 
 //chose weapon
 if (document.getElementById("show_weapon").checked) {
  buf1 = buf1 + "<span class=\"section\">Weapon Choice</span><br><div class=\"indent\">";
  
  var useArray;
  
  if (selectedClass == CLASS_BARB) {
   useArray = barbWeapons;
  }
  else if (selectedClass == CLASS_DH) {
   useArray = dhWeapons;
  }
  else if (selectedClass == CLASS_MONK) {
   useArray = monkWeapons;
  }
  else if (selectedClass == CLASS_WD) {
   useArray = wdWeapons;
  }
  else if (selectedClass == CLASS_WIZ) {
   useArray = wizWeapons;
  }
  
  var randomNum = Math.floor(Math.random()*useArray.length);
  buf1 = buf1 + "<p>You may only use: " + useArray[randomNum] + "</p>";
  buf2 = buf2 + "Weapon is limited to " + useArray[randomNum] + "<br><br>";
  
  buf1 = buf1 + "</div><br><br>";
 }
 
 buf1 = buf1 + "<span class=\"section\">Active Skills</span><br><div class=\"indent\">";
 buf2 = buf2 + "Active Skills<br>"
 
 if(rerollCount > 0){
  var end = "times"
  if(rerollCount == 1){
   end = "time"
  }
  
  buf1 = buf1 + "<p class=\"small\">You have re-rolled " + rerollCount + " " + end + "</p>"
  buf2 = "<span>You have re-rolled " + rerollCount + " " + end + "</span><br><br>" + buf2;
 }

 if (mode == "mode_draft"){
  buf1 = buf1 + "<p>You may choose 6 of the following " + assignedSkills.length + " skills (no switching later):</p>"
  buf2 = buf2 + "You may choose 6 of the following " + assignedSkills.length + " skills (no switching later):<br><br>"
 }
 
 //print skills
 for(var i in assignedSkills){
  var skill = assignedSkills[i];
  var levelText = "";
  var tooltipText1 = "<br>";
  var tooltipText2 = "";
 
  if (document.getElementById("show_levels").checked) {
     levelText = "<p class=\"levelreq\">Requires Level " + skill.levelReq + "</p>";
  }
  
  if (document.getElementById("show_tooltip").checked) {
     tooltipText1 = "<p class=\"tooltip\">" + skill.skillText + "</p>";
     tooltipText2 = "<p class=\"tooltip\">" + skill.runeText + "</p>";
  }
  
  buf1 = buf1 + "<div class=\"box\"><span class=\"skill\">" + skill.skillName + "</span>" + tooltipText1 + "<span class=\"rune\">" + skill.runeName + "</span>" + tooltipText2 + levelText + "</div>";
  buf2 = buf2 + "&nbsp;&nbsp;&nbsp;" + skill.skillName + " (" + skill.levelReq + ")" + "<br>"
  
  if (skill.runeName == ""){
   buf2 = buf2 + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "No rune" + "<br>";
  }else{
   buf2 = buf2 + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + skill.runeName + "<br>";
  }
 }
 
 buf1 = buf1 + "</div><br><br><span class=\"section\">Passive Skills</span><br><div class=\"indent\">";
 buf2 = buf2 + "<br>Passive Skills<br>"
 
 if (mode == "mode_draft"){
  buf1 = buf1 + "<p>You may choose " + actualMaxPassives + " of the following passives (no switching later):</p>"
  buf2 = buf2 + "You may choose " + actualMaxPassives + " of the following passives (no switching later):<br><br>"
 }
 
 //print passives
 for(var i in assignedPassives){
  var passive = assignedPassives[i];
  var levelText = "";
  var tooltipText = "";

  if (document.getElementById("show_levels").checked) {
     levelText = "<p class=\"levelreq\">Requires Level " + passive.levelReq + "</p>";
  }
  
  if (document.getElementById("show_tooltip").checked) {
     tooltipText = "<p class=\"tooltip\">" + passive.passiveText + "</p>";
  }

  buf1 = buf1 + "<div class=\"box\"><span class=\"passive\">" + passive.passiveName + "</span><br>" + tooltipText + levelText + "</div>";
  buf2 = buf2 + "&nbsp;&nbsp;&nbsp;" + passive.passiveName + " (" + passive.levelReq + ")<br>";
  
 }
 
 buf1 = buf1 + "</div><br><br><p><a href=\"javascript:window.print()\">Print build</a></p>";
 buf2 = buf2 + "<br><a href=\"javascript:hideSummary()\">Go back to generator</a><br>";
 buf2 = buf2 + "<a href=\"javascript:window.print()\">Print build</a>";
 buf2 = "<a href=\"javascript:hideSummary()\">Go back to generator</a><br><br>" + buf2;
 
 document.getElementById("skill_area").innerHTML = buf1;
 document.getElementById("Summary").innerHTML = buf2;
 
 document.getElementById("generate_button").value = "Reroll"
 rerollCount = rerollCount + 1;

 return;
}

function checkInput(){
 var elem = document.getElementById("level_selector");
 var numberRegExp = /^[0-9]+$/g;
 
 if (!(numberRegExp.test(elem.value))){
  alert("Please enter a valid value for the level limit.");
  return false;
 }
 
 if (elem.value <= 0){
  alert("Please enter a value above zero for the level limit.");
  return false;
 }
 
 return true;
}

function reset(){
 document.getElementById("generate_button").value = "Generate!"
 rerollCount = 0;
}

function changeMode(){
 var mode = document.getElementById("mode_selector").value;
 
 if (mode == "mode_random"){
  document.getElementById("max_skills_selector").style.display = "none";
  document.getElementById("max_skills_selector").value = "6";
  document.getElementById("max_passives_selector").style.display = "none";
  document.getElementById("max_passives_selector").value = "3";
 }else if (mode == "mode_choice"){
  document.getElementById("max_skills_selector").style.display = "inline";
  document.getElementById("max_skills_selector").style.disabled = false;
  document.getElementById("max_passives_selector").style.display = "inline";
  document.getElementById("max_passives_selector").style.disabled = false;
 }else if (mode == "mode_draft"){
  document.getElementById("max_skills_selector").style.display = "none";
  document.getElementById("max_passives_selector").style.display = "none";
 }
 
 reset();
}

function showSummary(){
  document.getElementById("Summary").style.display = "block";
  document.getElementById("Content").style.display = "none";
}

function hideSummary(){
  document.getElementById("Summary").style.display = "none";
  document.getElementById("Content").style.display = "block";
}