const gulp = require('gulp');
const minimist = require('minimist');
const nconf = require('nconf');
const shell = require('shelljs');
const lineReader = require('line-reader');
const Promise = require('bluebird');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const jsonar = require('jsonar')

nconf.file({ file: "config.json" });

var knownOptions = {
  "project": false
};

var options = minimist(process.argv.slice(2), knownOptions);

const project = options.project;

if(!project){
  console.error("Especifique el projecto");

  // TODO listar los projectos
  process.exit();
}

nconf.set(("projects:"+project+":build_number"), (nconf.get("projects:"+project+":build_number") + 1));
nconf.save();

gulp.task('help', () => {
  console.log("gulp --project <project_name> ");
  console.log("gulp --project <project_name> --omit-build-packages ");
  console.log("gulp --project <project_name> --devDependencies ");
});

let config_project = nconf.get("projects:"+project);
const directory_app = process.cwd();
if(!config_project.base_directory){
  throw "No esta definido el directorio base del proyecto en el archivo config.json.";
}
const project_directory = config_project.base_directory;
const diff_file = `${config_project.base_directory}/diff_custom.txt`;
let ignore_files_dic = [];

var list_files_package = [];
var manifest = {};
var installdefs = {};
var copy_defs = [];
let merxfile = {};

var archive = null;

let package_version = "";
shell.cd(config_project.base_directory);

if (fs.existsSync(config_project.base_directory+"/Merxfile.json")) {
  merxfile = JSON.parse(fs.readFileSync(config_project.base_directory+"/Merxfile.json"), 'utf8');
  config_project = merxfile;
  package_version = merxfile['version'];
  ignore_files_dic = merxfile['ignore_files']
}
else{
  throw "No existe el archvo Merxfile.json del proyecto";
}

if(!project){
  console.error("Especifique el proyecto");
  process.exit();
}

console.log("options:",options);

gulp.task('init-params', function(){
  console.log("init-params");
});

gulp.task('get-git-diff', () => {
  // shell.exec('echo "" > ' + diff_file);
  shell.exec('git diff --name-status ' + config_project.origin_commit+ ' HEAD custom/ > ' + diff_file);
});

gulp.task('get-add-and-modified',[
  'get-git-diff'
], function (done){
  eachLine = Promise.promisify(lineReader.eachLine);
  var addCounter = 0;
  eachLine(diff_file, (line) => {
    var action = line[0];
    var filename = line.replace(/\r?\n|\r/,'').replace(/^(\w{1})(\t)/,'');
    if(ignore_files_dic.includes(filename)){
      return;
    }

    switch (action) {
      case 'A':
			case 'M':
        if(!(list_files_package.includes(filename))){
          list_files_package.push(filename);
          addCounter++;
        }
        break;
      default:
        console.log("No implementado")
        break;
    }
  }).then(() =>{
    console.log("list_files_package:count:", list_files_package.length);
    done();
  })
});

gulp.task('zip-files', [
  "get-add-and-modified"
], () => {
  var output = fs.createWriteStream(__dirname + `/dist/${project}_custom_v${package_version}.zip`);
  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  output.on('end', function() {
    console.log('Data has been drained');
  });
  archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  archive.pipe(output);
  console.log("list_files_package:count,", list_files_package.length);
  list_files_package.every((filename) => {
    var full_filename = project_directory + '/' + filename;
    archive.append(fs.createReadStream(full_filename), { name: filename });
    copy_defs.push({
      "from": "<basepath>/"+filename,
      "to": filename
    });
    return filename;
  });
});

gulp.task('create-manifest', [
  "zip-files"
], () => {
  manifest = JSON.parse((fs.readFileSync(path.join(__dirname, 'manifest.json'))).toString());
  
  //manifest 
  manifest.key = project+"_custom";
  manifest.name = project+"_custom";
  manifest.description = project+"_custom";
  manifest.version = package_version;
  manifest.published_date = (new Date).toISOString();
  manifest.acceptable_sugar_versions = config_project.acceptable_sugar_versions;
  manifest.acceptable_sugar_flavors = config_project.acceptable_sugar_flavors;
  installdefs = {
    "id": project+"_custom",
    "copy": copy_defs
  };

  var manifestArray = jsonar.arrify(manifest, {prettify: true})
  var installdefsArray = jsonar.arrify(installdefs, {prettify: true})
  // console.log("manifestArray:", installdefsArray);

  var manifestBuffer = Buffer.from("<?php\n \$manifest ="+manifestArray + "\n \$installdefs = " + installdefsArray);
  archive.append(manifestBuffer, { name: 'manifest.php' });
  archive.finalize();
});


gulp.task('last', [
  'zip-files'
], () => {
 console.log("last")
});

gulp.task('default',[
  'init-params',
  'get-git-diff',
  'get-add-and-modified',
  'zip-files',
  'create-manifest',
  'last'
]);
