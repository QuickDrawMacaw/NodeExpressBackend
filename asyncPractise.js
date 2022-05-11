const { get } = require("config");


console.log('Before');

//chaining promise. (8. Consuming Promises - Mosh)
// getUser(1)
//     .then(user => getRepositories(user.gitHubUsername))
//     .then(repos => getCommits(repos[0]))
//     .then(commits => console.log('Commits ',commits))
//     .catch(err => console.log('Error', err.message));

 async function displayCommits() {
    try {
        const user = await getUser(1);
        const repos = await getRepositories(user.gitHubUsername);
        const commits = await getCommits(repos[0]);
        console.log(commits); 
    } catch (error) {
        console.log('Error:', error.message);
    }
}
displayCommits();


console.log('After');

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {console.log('reading a user from a database');
        resolve({ id: id, gitHubUsername: 'yuki'})
        }, 2000);
    });
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("Calling Github api...");
        resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {console.log('Calling the Github API');
        resolve(['commit'])
        }, 2000);
    })
}