# SugarCRM Custom Packager

Instalar dependencias

```javascript
npm install
```

Ejecutar

```bash
gulp --project selanusa
```

🍺 👍

## Archivo de Configuración General.

El archivo config.json contiene la configuración general de los proyectos, en este caso el directorio base.
Dependiendo del entorno va a variar la ruta del directorio base de cada proyecto.

Estructura
```json
{
  "projects": {
  	"<project_name>":{
  		"base_directory": "<base_directory>",
  	}
  }
}
```

```json
{
  "projects": {
  	"aforexxi":{
  		"base_directory": "/Users/betobaz/Documents/Merx/vagrant/sugarcrm_php71es56/aforexxi.merxbp.loc/",
  	}
  }
}
```
