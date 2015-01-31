function Map(coor){

	this.Coor = coor;
	this.CharArray = [];
	
	
}

function MapWild(coor, chararray, matrixenemies){
	Map.call(this, coor);

	this.MatrixEnemies = matrixenemies;

}

MapWild.protoype = new Map();

function MapCity(coor, chararray, arraybuildings){
	Map.call(this, coor);

	this.ArrayBuildings = arraybuildings;

}

MapCity.prototype = new Map();
