function Map(coor, chararray){

	this.Coor = coor;
	this.CharArray[] = chararray;
	
	
}

function MapWild(coor, chararray, matrixenemies){
	Map.call(this, coor, chararray);

	this.MatrixEnemies = matrixenemies;

}

MapWild.protoype = new Map();

function MapCity(coor, chararray, arraybuildings){
	Map.call(this, coor, chararray);

	this.ArrayBuildings = arraybuildings;

}

MapCity.prototype = new Map();
