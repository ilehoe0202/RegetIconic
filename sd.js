var fs = require('fs');
var dir = './nlegs';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
let student = { 
    name: 'Mikee',
    age: 23, 
    gender: 'Male',
    department: 'English',
    car: 'Honda' 
};
let data = JSON.stringify(student);
fs.writeFileSync('./nlegs/student-2.json', data);