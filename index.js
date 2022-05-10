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
    
    //Validate
    const {error} = validateCourse(request.body);
    if(error) {
        response.status(400).send(error.details[0].message)
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


    //Validate
    const {error} = validateCourse(request.body);
    if(error) {
        response.status(400).send(error.details[0].message)
        return;
    }

    //Update course
    course.name = request.body.name;
    //Return the updated course
    response.send(course);


})

app.delete('/api/courses/:id', (request, response) => {
    //Look up the course
    const course = courses.find(c => c.id === parseInt(request.params.id))

    //Not existing, return 404
    if(!course) // 404
    response.status(404).send('The course with the given id was not found.');

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