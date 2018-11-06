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

El archivo config.json contiene la configuración general de los proyectos, en este caso el directorio base. Dependiendo del entorno va a variar la ruta del directorio base de cada proyecto.

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

## Archivo de Merxfile.json del proyecto

Dentro del directorio del proyecto de SugarCRM deberá de existir un archivo con nombre *Merxfile.json*, el cual contienen las configuraciones especificas para la construcción del paquete de personalizaciones.

```json
{
	// Número de versión que es utilizado dentro del archivo manifest.php y el nombre del archivo, ejemplo: aforexxi_custom_v1.11.2
	"version": "1.11.2",
	// Nombre del branch dentro del repositorio https://github.com/MerxBusinessPerformance/custom_sugarcrm
	"branch_name": "aforexxi",
	// Hash del commit a partir de cual se desea considerar los archivos agregados o modificados para implementar en la instancia, utilizado para ejecutar el comando *git diff <hash> HEAD*
	"origin_commit": "f1d61f2338dcd660f89dc810a05b0135e1d40d5a",
	// Versiones de SugarCRM que son soportadas
	"acceptable_sugar_versions": {
		"exact_matches": [
			"8.0.0",
			"8.0.1",
			"8.1.0"
		],
		"regex_matches": [
			"8\\.0\\.[0-2]\\.[0-9]$",
			"8\\.1\\.[0-2]\\.[0-9]$"
		]
	},
	// Sabor de SugarCRM que son soportadas
	"acceptable_sugar_flavors": [
		"ENT"
	],
	// Diccionario de archivos que se desean ignorar durante el empaquetamiento
	"ignore_files":[
		"custom/modules/ForecastWorksheets/clients/base/views/list/list.php"
	],
	// Dependencias https://github.com/MerxBusinessPerformance/sugarcrm_packages
	"dependencies":{
		"Dias_Festivos2018_08_01_211254":"1533221322",
		"MB_CatalogosAgentes": "1534955126",		
		"CF_AforeXXI":"1.48.0",
		"PI_UsuariosEquiposRoles":"2.0.15",
		"PI_ReportesAforeXXI":"1.4.0",
		"PI_EmailTemplatesAforeXXI":"1.3.2",
		"PI_LoadBPMFile":"2.2.0",
		"PI_LoadDashboards":"1.4.1",
		"PI_CatalogosAgentes":"1.2"
	}
}
```











