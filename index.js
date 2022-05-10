const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
]

app.get('/', (request, response) => {
    response.send('Hello World!');
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

    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });

    
    const result = schema.validate(request.body); 
    console.log(result) 
    if(result.error) {
        response.status(400).send(result.error.details[0].message)
        return;
    }

    const course = {
        id: courses.length + 1,
        name: request.body.name
    };
    courses.push(course);
    response.send(course);
});

app.put('/api/courses/:id', (request, response) => {
    
    const course = courses.find(c => c.id === parseInt(request.params.id))
    if(!course) // 404
    response.status(404).send('The course with the given id was not found.');
    //response.send(course);


    //Validate
    result = validateCourse(request.body);

    if(result.error) {
        response.status(400).send(result.error.details[0].message)
        return;
    }

    //Update course
    course.name = request.body.name;
    //Return the updated course
    response.send(course);


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