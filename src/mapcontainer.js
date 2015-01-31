//contenedor del worldmap
function MapContainer()
{
  this.MaxX = 50;
  this.MaxY = 50;

  this.MatrixMap[];
  
  this.Initialize = function(MaxX, MaxY, MatrixMap) //Inicializa una matriz de objetos tipo Mapa
  {
    for(i = 0; i < MaxX; i++)
    {
      MatrixMap[i] = new Array();
      
      for(j = 0; i < MaxY; j++)
      {
        MatrixMap[i][j] = New Map(new Array(i,j));
      }
    }
  }
  

}
