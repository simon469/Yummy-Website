let mealData = document.getElementById("mealData");
let searchContainer = document.getElementById("search");
let submitBtn;
// open nav
function openNav() {
    $(".side-nav").animate({
        left: 0
    }, 500);
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}
//close nav
function closeNav() {
    let navMenuWidth = $(".side-nav .nav-menu").outerWidth();
    $(".side-nav").animate({
        left: - navMenuWidth
    }, 500);
    $(".open-close-icon").removeClass("fa-x");
    $(".open-close-icon").addClass("fa-align-justify");
    $(".links li").animate({
        top: 300
    }, 500);
}
closeNav();
//toggle between open and close 
$(".side-nav .nav-head i.open-close-icon").click(function() {
    if($(".side-nav").css("left") == "0px") {
        closeNav();
    }else {
        openNav();
    }
});

// search
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ms-4">
        <div class="col-md-6 mb-4">
            <input onkeyup="searchByName(this.value)" type="text" class="form-control bg-transparent text-white" placeholder="Search By Meal Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" type="text" class="form-control bg-transparent text-white" maxlength="1" placeholder="Search By Meal First Letter">
            <!-- maxlength attribute specifies the maximum number of characters allowed in the <input> element. -->
        </div>
    </div>`
    mealData.innerHTML = ""
}

async function searchByName(inputValue) {
    closeNav();
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`);
    response = await response.json();
    let meals = response.meals;
    $(".inner-loading").fadeOut(300);
    meals ? displayMeals(meals) : displayMeals([]);
}

async function searchByFLetter(inputLetter) {
    closeNav();
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    inputLetter == "" ? inputLetter = "a" : ""; // default
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${inputLetter}`)
    response = await response.json();
    let meals = response.meals;
    $(".inner-loading").fadeOut(300);
    meals ? displayMeals(meals) : displayMeals([]);
}
async function searchEmpty() {
    searchByName("");
}

$(".logo").click(function() {
    searchEmpty();
})

$(document).ready(function() {
    searchEmpty();
    $(".loading").fadeOut(500);
    $("body").css("overflow", "visible");
});
// Categories
async function getCategories() {
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    response = await response.json();
    let categories = response.categories;
    $(".inner-loading").fadeOut(300);
    displayCategories(categories);
}

function displayCategories(category) {
    // Clear the existing content
    document.getElementById('mealData').innerHTML = '';

    for (let i = 0; i < category.length; i++) {
        // Create the main container div
        let colDiv = document.createElement('div');
        colDiv.className = 'col-md-4 col-lg-3';

        // Create the meal div
        let mealDiv = document.createElement('div');
        mealDiv.className = 'meal position-relative overflow-hidden rounded-2 cursor-pointer';
        mealDiv.setAttribute('onclick', `getCategoryMeals('${category[i].strCategory}')`);

        // Create the img element
        let img = document.createElement('img');
        img.className = 'w-100 img-fluid';
        img.src = category[i].strCategoryThumb;
        img.alt = 'meal image';

        // Create the meal-layer div
        let mealLayerDiv = document.createElement('div');
        mealLayerDiv.className = 'meal-layer position-absolute text-center text-black p-2';

        // Create the h3 element
        let h3 = document.createElement('h3');
        h3.textContent = category[i].strCategory;

        // Create the p element
        let p = document.createElement('p');
        let description = category[i].strCategoryDescription.split(' ').slice(0, 20).join(' ');
        p.textContent = description;

        // Append elements to their respective parents
        mealLayerDiv.appendChild(h3);
        mealLayerDiv.appendChild(p);
        mealDiv.appendChild(img);
        mealDiv.appendChild(mealLayerDiv);
        colDiv.appendChild(mealDiv);

        // Append the main container div to the mealData container
        document.getElementById('mealData').appendChild(colDiv);
    }
}

// get meals by category
async function getCategoryMeals(mealcategory) {
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealcategory}`);
    response = await response.json();
    // display 20 meal
    let meals = response.meals.slice(0, 20);
    $(".inner-loading").fadeOut(300);
    displayMeals(meals);
}
// DisplayMeals
function displayMeals(meals) {
    // Clear the existing content
    document.getElementById('mealData').innerHTML = '';

    for (let i = 0; i < meals.length; i++) {
        // Create the main container div
        let colDiv = document.createElement('div');
        colDiv.className = 'col-md-3';

        // Create the meal div
        let mealDiv = document.createElement('div');
        mealDiv.className = 'meal position-relative overflow-hidden rounded-2 cursor-pointer';
        mealDiv.setAttribute('onclick', `getMealDetails('${meals[i].idMeal}')`);

        // Create the img element
        let img = document.createElement('img');
        img.className = 'w-100';
        img.src = meals[i].strMealThumb;
        img.alt = 'meal image';

        // Create the meal-layer div
        let mealLayerDiv = document.createElement('div');
        mealLayerDiv.className = 'meal-layer catogry-meal position-absolute d-flex justify-content-center align-items-center text-black p-2';

        // Create the h3 element
        let h3 = document.createElement('h3');
        h3.className = 'text-center';
        h3.textContent = meals[i].strMeal;

        // Append elements to their respective parents
        mealLayerDiv.appendChild(h3);
        mealDiv.appendChild(img);
        mealDiv.appendChild(mealLayerDiv);
        colDiv.appendChild(mealDiv);

        // Append the main container div to the mealData container
        document.getElementById('mealData').appendChild(colDiv);
    }
}


// get meal details by idMeal
async function getMealDetails(mealID) {
    closeNav();
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
    // console.log(respone);
    let mealsdetails = respone.meals[0];
    // console.log(mealsdetails);
    $(".inner-loading").fadeOut(300);
    displayMealDetails(mealsdetails);
}

function displayMealDetails(mealsdetails) {
    $("#search").html("");

    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (mealsdetails[`strIngredient${i}`]) {
            ingredients += `
            <li class="alert alert-info m-2 p-1">${mealsdetails[`strMeasure${i}`]} ${mealsdetails[`strIngredient${i}`]}</li>
            `
        }
    }

    let tags = mealsdetails.strTags?.split(",");
    if (!tags) tags = []; 
    let tagsStr = '';
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-2">${tags[i]}</li>`
    }

    let details = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${mealsdetails.strMealThumb}" alt="">
                    <h2 class="mt-4 text-center detail">${mealsdetails.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h3>Instructions</h3>
                <p class="detail">${mealsdetails.strInstructions}</p>
                <h3 class="area-detail"><span class="fw-bolder">Area : </span>${mealsdetails.strArea}</h3>
                <h3 class="area-detail"><span class="fw-bolder">Category : </span>${mealsdetails.strCategory}</h3>
                <h3 class="area-detail">Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>
                <h3 class="area-detail">Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${mealsdetails.strSource}" class="btn btn-success me-3">Source</a>
                <a target="_blank" href="${mealsdetails.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`
    $("#mealData").html(details);
}
// get Area
async function getArea() {
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    respone = await respone.json();
    let area = respone.meals;
    // console.log(area);
    $(".inner-loading").fadeOut(300);
    displayArea(area);
}

function displayArea(area) {
    let areaBox = "";
    for (let i = 0; i < area.length; i++) {
        areaBox += `
        <div class="col-md-3">
        <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center text-white cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-3x mb-3"></i>
                <h3 class="area">${area[i].strArea}</h3>
        </div>
    </div>`
    }
    $("#mealData").html(areaBox);
}

// get meals by area
async function getAreaMeals(mealsArea) {
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${mealsArea}`);
    response = await response.json();
        // display 20 meal
        let meals = response.meals.slice(0, 20);
        // console.log(meals);
    $(".inner-loading").fadeOut(300);
    displayMeals(meals);
}

//Ingredient
async function getIngredients() {
    $("#search").html("");
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
        // display 20 meal
        let meals = response.meals.slice(0, 20);
        // console.log(meals);
    $(".inner-loading").fadeOut(300);
    displayIngredients(meals);
}

function displayIngredients(mealsIngredient) {
    let ingredientbox = "";
    for (let i = 0; i < mealsIngredient.length; i++) {
        ingredientbox += `
        <div class="col-md-4 col-lg-3">
            <div onclick="getIngredientsMeals('${mealsIngredient[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x mb-3"></i>
                    <h3>${mealsIngredient[i].strIngredient}</h3>
                    <p class="desc">${mealsIngredient[i].strDescription.split(" ").slice(0,20).join(" ")} .....</p>
            </div>
        </div>`
    }
    $("#mealData").html(ingredientbox);
}

async function getIngredientsMeals(ingredients) {
    $("#mealData").html("");
    $(".inner-loading").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    response = await response.json();
        // display 20 meal
        let meals = response.meals.slice(0, 20);
        // console.log(meals);
    $(".inner-loading").fadeOut(300);
    displayMeals(meals);
}

// Contact Us
function showContact() {
    const mealData = document.getElementById('mealData');
    mealData.innerHTML = '';

    const contactDiv = document.createElement('div');
    contactDiv.className = 'contact min-vh-100 d-flex justify-content-center align-items-center';

    const containerDiv = document.createElement('div');
    containerDiv.className = 'container w-75 text-center';

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-4';

    // Helper function to create input fields and alerts
    function createInputField(colClass, inputId, inputType, placeholderText, alertId, alertText) {
        const colDiv = document.createElement('div');
        colDiv.className = colClass;

        const input = document.createElement('input');
        input.id = inputId;
        input.type = inputType;
        input.className = 'form-control';
        input.placeholder = placeholderText;
        input.onkeyup = inputsValidation;

        const alertDiv = document.createElement('div');
        alertDiv.id = alertId;
        alertDiv.className = 'alert alert-danger w-100 mt-2 d-none';
        alertDiv.textContent = alertText;

        colDiv.appendChild(input);
        colDiv.appendChild(alertDiv);

        return colDiv;
    }

    // Append input fields and alerts to rowDiv
    rowDiv.appendChild(createInputField('col-md-6', 'nameInput', 'text', 'Enter Your Name', 'nameAlert', 'Special characters and numbers not allowed'));
    rowDiv.appendChild(createInputField('col-md-6', 'emailInput', 'email', 'Enter Your Email', 'emailAlert', 'Email not valid *exemple@yyy.zzz'));
    rowDiv.appendChild(createInputField('col-md-6', 'phoneInput', 'text', 'Enter Your Phone', 'phoneAlert', 'Enter valid Phone Number'));
    rowDiv.appendChild(createInputField('col-md-6', 'ageInput', 'number', 'Enter Your Age', 'ageAlert', 'Enter valid age'));
    rowDiv.appendChild(createInputField('col-md-6', 'passwordInput', 'password', 'Enter Your Password', 'passwordAlert', 'Enter valid password *Minimum eight characters, at least one letter and one number:*'));
    rowDiv.appendChild(createInputField('col-md-6', 'repasswordInput', 'password', 'Repassword', 'repasswordAlert', 'Enter valid repassword'));

    // Append rowDiv to containerDiv
    containerDiv.appendChild(rowDiv);

    // Create and append the submit button
    const submitBtn = document.createElement('button');
    submitBtn.id = 'submitBtn';
    submitBtn.className = 'btn btn-outline-danger px-2 mt-3';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submit';

    containerDiv.appendChild(submitBtn);

    // Append containerDiv to contactDiv
    contactDiv.appendChild(containerDiv);

    // Append contactDiv to mealData
    mealData.appendChild(contactDiv);

    // Add focus event listeners
    document.getElementById('nameInput').addEventListener('focus', () => {
        nameTouched = true;
    });

    document.getElementById('emailInput').addEventListener('focus', () => {
        emailTouched = true;
    });

    document.getElementById('phoneInput').addEventListener('focus', () => {
        phoneTouched = true;
    });

    document.getElementById('ageInput').addEventListener('focus', () => {
        ageTouched = true;
    });

    document.getElementById('passwordInput').addEventListener('focus', () => {
        passwordTouched = true;
    });

    document.getElementById('repasswordInput').addEventListener('focus', () => {
        repasswordTouched = true;
    });
}

// default focus in inputs is false
let nameTouched = false;
let emailTouched = false;
let phoneTouched = false;
let ageTouched = false;
let passwordTouched = false;
let repasswordTouched = false;

// validation (regex)
function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value));
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value));
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value));
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value));
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value));
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
}

function inputsValidation() {

    if (nameTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block");
        }
    }

    if (emailTouched) {
        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        }
    }

    if (phoneTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        }
    }

    if (ageTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block");
        }
    }

    if (passwordTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        }
    }
    if (repasswordTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
        }
    }

    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() &&
    passwordValidation() && repasswordValidation()) {
    submitBtn.removeAttribute("disabled");
    } else {
    submitBtn.setAttribute("disabled", true);
}
}
// Events
$(".show-search").click(function() {
    showSearchInputs();
    closeNav();
});

$(".categories").click(function() {
    getCategories();
    closeNav();
});

$(".meals-area").click(function() {
    getArea();
    closeNav();
});

$(".meals-Ingredients").click(function() {
    getIngredients();
    closeNav();
});

$(".show-contact").click(function() {
    showContact();
    closeNav();
});