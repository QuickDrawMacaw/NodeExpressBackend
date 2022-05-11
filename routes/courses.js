const express = require('express');
const router = express.Router(); 
const Joi = require('joi');

const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
]

router.get('/', (request, response) => {
    response.send(courses);
});

// /api/courses

router.get('/:id', (request, response) => {
    const course = courses.find(c => c.id === parseInt(request.params.id))
    if(!course) // 404
    response.status(404).send('The course with the given id was not found.');
    response.send(course);
});

router.post('/', (request, response) => {
    
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

router.put('/:id', (request, response) => {
    
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

router.delete('/:id', (request, response) => {
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

module.exports = router;
