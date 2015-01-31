function Character(charname, coor) {

	this.CharName = charname;
	this.Coor[] = coor;

	this.Move = funtion(cardinal){

		if (cardinal == "N")
		{
			if this.Coor[1] == 0
			{
				console.log("You have reached the limit of the map");
			}
			else
			{
				this.Coor[1] = this.Coor[1] - 1;	
			}
			
		}
		else if (cardinal == "S")
		{
			if this.Coor[1] == 100 //FIN DEL MAPA ¿LLAMADA AL MAPCONTAINER?
			{
				console.log("You have reached the limit of the map")
			}
			else
			{
				this.Coor[1] = this.Coor[1] + 1;
			}
		}
		else if (cardinal == "E")
		{
			if this.Coor[0] == 100 //FIN DEL MAPA ¿LLAMADA AL MAPCONTAINER?
			{
				console.log("You have reached the limit of the map")
			}
			else
			{
				this.Coor[0] = this.Coor[0] + 1;
			}
			
		}
		else if (cardinal == "W")
		{
			if this.Coor[0] == 0
			{
				console.log("You have reached the limit of the map");
			}
			else
			{
				this.Coor[0] = this.Coor[0] - 1;	
			}
		}

	};

	this.Hunt = function(){

		//to do

	};
}
