//definir edificios
function Building(coor){
  
    this.Coor = coor;
    
}

function Temple(coor, deity){
Building.call(this, coor);

this.Deity = deity;

}

Temple.prototype = new Building();

function Tower(coor, namewiz){
  Building.call(this, coor);
  
  this.NameWiz = namewiz;
}

Tower.prototype = new Building();

function TotemPole(coor, NameCham){
  Building.call(this, coor);
  
  this.NameCham = namecham;
}

TotemPole.prototype = new Building();

function Shop(coor){
  Building.call(this, coor);
  
}

Shop.prototype = new Building;
