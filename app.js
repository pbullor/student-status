

const login = async (email, password) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            email: email,
            password: password,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        const response = await fetch(
            "https://breathecode.herokuapp.com/v1/auth/login/",
            requestOptions
        );
        const data = await response.json();

        return data.token;
    } catch (error) {
        console.error("Error in login:", error);
        throw error;
    }
};

const getStudentID = async (token, mail) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + token);
        myHeaders.append("Academy", "7");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        const response = await fetch(
            `https://breathecode.herokuapp.com/v1/auth/academy/student?limit=10&offset=0&like=${mail}`,
            requestOptions
        );
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error getting data students:", error);
        throw error;
    }
};

const getStatus = async (token, studentID) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + token);
        myHeaders.append("Academy", "7");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        const response = await fetch(
            ` https://breathecode.herokuapp.com/v1/assignment/academy/cohort/210/task?academy=7&limit=1000&task_type=PROJECT,LESSON,EXERCISE&student=${studentID}`,
            requestOptions
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting data students:", error);
        throw error;
    }
};

const getFinalStatus = (proyectos) => {
    let lecturas = false;
    let practicaHTML = false;
    let practicaCSS = false;
    let practicaLayout = false;
    let postcard = false;
    let igPhotoFeed = false;
    let practicaJS = false;
    let practicaJSAdv = false;
    let excuse = false;
    let estado = "";
    proyectos.forEach(item => {
        if (item.task_type == "LESSON" && item.task_status == "DONE")
            lecturas = true;
        if (item.task_type == "EXERCISE" && item.title == "Learn HTML" && item.task_status == "DONE")
            practicaHTML = true;
        if (item.task_type == "EXERCISE" && item.title == "Learn CSS" && item.task_status == "DONE")
            practicaCSS = true;
        if (item.task_type == "EXERCISE" && item.title == "Doing Layouts" && item.task_status == "DONE")
            practicaLayout = true;
        if (item.task_type == "EXERCISE" && item.title == "Introduction to JS" && item.task_status == "DONE")
            practicaJS = true;
        if (item.task_type == "EXERCISE" && item.title == "More practicing JS" && item.task_status == "DONE")
            practicaJSAdv = true;
    })
    estado = (lecturas ? "Activo - lecturas" : "Activo sin lecturas") + (practicaHTML ? " - HTML" : "") + (practicaCSS ? " - CSS" : "") + (practicaLayout ? " - Layout" : "")
        + (practicaJS ? " - JS" : "") + (practicaJSAdv ? " - Master JS" : "");
    return estado;
}

const mails = ["mgonzalezca1991@gmail.com", "pablomero@gmail.com", "gabiperezpr@hotmail.com"];

const token = await login("pablo@4geeks.co", "Agosto31");
console.log("token " + token);

let salida = [];

for (let i = 0; i < mails.length; i++) {
    let proyectos = "";
    let status = "Sin acceso"
    let id = await getStudentID(token, mails[i]);
    let id4geeks=0;

    if (id.results.length > 0) {
        if (id.results[0].status != "INVITED") {
            console.log("Mail: " + mails[i] + " id: " + id.results[0].user.id)
             id4geeks = id.results[0] ? id.results[0].user.id : 0;

            if (id4geeks > 0) {
                proyectos = await getStatus(token, id4geeks);
                status = getFinalStatus(proyectos.results)
            }
        }
        else {status = "Sin Acceso"}
    }
    let student = {
        mail: mails[i],
        id4geeks: id4geeks,
        estado: status,
    };
    salida.push(student);
}

console.log(salida);
