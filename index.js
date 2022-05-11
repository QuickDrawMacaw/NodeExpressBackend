const debug = require('debug')('app:startup');

const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();
const Joi = require('joi');
const logger = require('./logger');
const authenticator = require('./authenticator');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

//Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled');
}



app.use(logger);
app.use(authenticator);


const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
]

app.get('/', (request, response) => {
    response.render('index', { title: "My Express App", message: "Hello" })
});

app.get('/api/courses', (request, response) => {
    response.send(courses);
});

// /api/courses

app.get('/api/courses/:id', (request, response) => {
    const course = courses.find(c => c.id === parseInt(request.params.id))
    if(!course) // 404
    response.status(404).send('The course with the given id was not found.');
    response.send(course);
});

app.post('/api/courses', (request, response) => {
    
    //Validate
    const {error} = validateCourse(request.body);
    if(error) return response.status(400).send(error.details[0].message);
         
    const course = {
        id: courses.length + 1,
        name: request.body.name
    };
    courses.push(course);
    response.send(course);
});

app.put('/api/courses/:id', (request, response) => {
    
    const course = courses.find(c => c.id === parseInt(request.params.id))
    if(!course) return response.status(404).send('The course with the given id was not found.');

    //Validate
    const {error} = validateCourse(request.body);
    if(error) return response.status(400).send(error.details[0].message)
        
    //Update course
    course.name = request.body.name;
    //Return the updated course
    response.send(course);
})

app.delete('/api/courses/:id', (request, response) => {
    //Look up the course
    const course = courses.find(c => c.id === parseInt(request.params.id))

    //Not existing, return 404
    if(!course) return response.status(404).send('The course with the given id was not found.');


    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1); //(the course id, remove only one object)

    //Return the same course
    response.send(course)
})

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });

    return schema.validate(course); 
}

//PORT 
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));