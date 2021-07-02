function startApp() {
    Kinvey.init({
        appKey: 'kid_BkV01GU2_',
        appSecret: '6345a55c7703466fb5c27f70cd3e6171',
        masterSecret: '1e871542170f4a90a3da90fcb7776ffc',
        apiVersion: 5
    });

    Kinvey.ping().then(function (response) {
        console.log('Kinvey Ping Success. Kinvey Service is alive, version: '
            + response.version
            + ', response: '
            + response.kinvey
        );
    }).catch(function (error) {
        console.log('Kinvey Ping Failed. Response: ' + error.description);
    });

    $('.links').on('click', function () {
        $(document).scrollTop(0);
    });

    $('.btn').on('click', function () {
        $(document).scrollTop(0);
    });

    sessionStorage.clear()
    showHideMenuLinks()

    // events
    $('.login').on('click', showLoginView)
    $('.register').on('click', showRegisterView)
    $('.home').on('click', showHomeView)
    $('.logo').on('click', showHomeView)
    $('#signUpBtn').on('click', showRegisterView)
    $('#btnRegister').on('click', showRegisterView)
    $('#signInBtn').on('click', showLoginView)
    $('#btnLogin').on('click', showLoginView)
    $('.all-cars').on('click', showAllCarsView)
    $('.cars-for-sale').on('click', showCarsForSaleView)
    $('#registerUser').on('click', registerUser)
    $('#loginUser').on('click', loginUser)
    $('.logOut').on('click', logoutUser)
    $(".post-car").on('click', postCarView)
    $(".my-cars").on('click', showMyCarsView)
    $(".my-cars").on('click', myCarsPage)
    $(".top-cars").on('click', showTopCarsView)
    $("#uploadCar").on('click', uploadYourCar)
    $(".top-cars").on('click', topCars)
    $("#powerAsc").on('click', orderCarsByPowerAsc)
    $("#powerDes").on('click', orderCarsByPowerDes)
    $("#yearAsc").on('click', orderCarsByYearAsc)
    $("#yearDes").on('click', orderCarsByYearDes)

    $("form").submit(function (event) {
        event.preventDefault()
    });

    // views - hide and show
    function hideAllViews() {
        $('#loginView').hide()
        $('#registerView').hide()
        $('#allCarsView').hide()
        $('#allCarsNotLoggView').hide()
        $('#carsForSaleView').hide()
        $('#postCarView').hide()
        $('#homeView').hide()
        $('#notLogged').hide()
        $('#myCarsView').hide()
        $('#topCarsView').hide()
        $('#noMyCarView').hide()
    }

    function showHideMenuLinks() {
        hideAllViews();
        if (sessionStorage.getItem('authToken') === null) {
            $('.login-register').show();
            $('.all-cars').show();
            $('.post-car').show();
            $('.my-cars').hide();
            $('.userWelcome').hide();
            $('.logOut').hide();
            $('#homeView').show()
        } else {
            $('.userWelcome').text(`Welcome, ${sessionStorage.getItem('userName')}!`);
            $('.logi-register').hide();
            $('.my-cars').show()
            $('.userWelcome').show();
            $('.logOut').show();
            $('#homeView').show()
        }
    }

    function showHomeView() {
        hideAllViews()
        $('#homeView').show()
        activeLink('home')
    }

    function showAllCarsView() {
        hideAllViews()
        activeLink('all-cars')

        if (sessionStorage.getItem('authToken') !== null) {
            $('#allCarsView').show()
            $('#allCarsView').empty()
            allCarsPage()
        } else {
            $('#allCarsNotLoggView').show()
        }
    }

    function showCarsForSaleView() {
        hideAllViews()
        $('#carsForSaleView').show()
        activeLink('cars-for-sale')
    }

    function showLoginView() {
        hideAllViews()
        $('#loginView').show()
        activeLink('login')
    }

    function showRegisterView() {
        hideAllViews()
        $('#registerView').show()
        activeLink('register')
    }

    function showMyCarsView() {
        hideAllViews()
        $('#myCarsView').show()
        activeLink('my-cars')
    }

    function showTopCarsView() {
        hideAllViews()

        if (sessionStorage.getItem('authToken') === null) {
            $('.post-car-title').text('To see top 10 cars you must be logged in!')
            $('#notLogged').show()
        } else {
            $("#topCarsView").show()
        }
        activeLink('top-cars')
    }

    function postCarView() {
        hideAllViews()

        if (sessionStorage.getItem('authToken') === null) {
            $('.post-car-title').text('To post your car you must be logged in!')
            $('#notLogged').show()

        } else {
            $('.post-car-title').text('Post your car')
            $('#postCarView').show()
        }
        activeLink('post-car')
    }

    // navbar change color on clicked element
    function activeLink(className) {
        $('.links').children().css("color", "white")
        $(`.${className}`).css("color", "#007bff")
        var mobileLink = document.getElementById("mobil-links");
        mobileLink.style.display = "none"
    }

    // kinvey - database
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_BkV01GU2_";
    const kinveyAppSecret = "6345a55c7703466fb5c27f70cd3e6171";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken)
        sessionStorage.setItem('userId', userInfo._id)
        sessionStorage.setItem('userName', userInfo.username)
    }

    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " + sessionStorage.getItem('authToken'),
        };
    }


    // register,login and logout
    function registerUser() {
        let username = $('#registerForm input[name=username]').val()
        let password = $('#registerForm input[name=password]').val()
        let repeatPassword = $('#registerForm input[name=repeatPassword]').val()
        let email = $('#registerForm input[name=email]').val()

        if (username.length < 3) {
            showError('The username should be at least 3 characters long')
        } else if (username.length > 20) {
            showError('The username is too long')
        } else if (password.length < 6) {
            showError('The password should be at least 6 characters long')
        } else if (username === '' || password === '') {
            showError('The fields cannot be empty')
        } else if (password !== repeatPassword) {
            showError('The password and repeatPassword must bt the same')
        } else {
            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
                headers: kinveyAppAuthHeaders,
                data: { username, password, email }
            }).then(function (res) {
                saveAuthInSession(res)
                showHideMenuLinks()
                showInfo('User registration successful.')
                $('#registerForm ').trigger('reset')
                $('.login-register').hide()
            }).catch(handleAjaxError)
        }
        activeLink('home')
    }

    function loginUser() {
        let username = $('#loginForm input[name=username]').val()
        let password = $('#loginForm input[name=password]').val()

        if (username.length < 3) {
            showError('The username should be at least 3 characters long')
        } else if (password.length < 6) {
            showError('The password should be at least 6 characters long')
        } else if (username === '' || password === '') {
            showError('The fields cannot be empty')
        } else {
            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
                data: { username, password },
                headers: kinveyAppAuthHeaders
            }).then(function (res) {
                saveAuthInSession(res)
                showHideMenuLinks()
                showInfo('Login successful.')
                $('#loginForm').trigger('reset')
                $('.login-register').hide()
            }).catch(handleAjaxError)
        }

        activeLink('home')
    }

    function logoutUser() {
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/_logout",
            headers: getKinveyUserAuthHeaders()
        }).then(function () {
            sessionStorage.clear()
            showHideMenuLinks()
            showInfo('Logout successful.')
        }).catch(handleAjaxError)

        activeLink('home')
    }

    //post your car
    function uploadYourCar() {
        var imageContainer = $('#carImage')
        imageContainer.removeAttr('src').replaceWith(imageContainer.clone())

        var token = sessionStorage.getItem('authToken');
        var owner = sessionStorage.getItem('userName')
        var image = $('#fileImage').val()
        var brand = $('#carForm input[name=carBrand]').val()
        var model = $('#carForm input[name=carModel]').val()
        var year = $('#carForm input[name=carYear]').val()
        var power = $('#carForm input[name=carPower]').val()
        var description = $('#carForm textarea[name=textarea]').val()

        var id = '_' + Math.random().toString(36).substr(2, 9);
        if (image === "") {
            showError('Please insert car image')
        } else if (brand === "" || model === "" || year === "" || power === "" || description === "") {
            showError('The fields cannot be empty!')
        } else {
            $.ajax({
                method: "POST",
                data: { owner, brand, model, year, power, description, token, id },
                headers: getKinveyUserAuthHeaders(),
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/cars"
            }).then(() => {
                uploadImage(id)
                showInfo('Car upload successfully.')
            }).then(() => {
                showHomeView()
                $('#carForm').trigger('reset')
            }).catch(handleAjaxError)
        }

        activeLink('my-cars')
    }

    function uploadImage(id) {
        var fileContent = document.getElementById('fileImage').files[0];
        var filename = document.getElementById('fileImage').files[0].name;
        var owner = sessionStorage.getItem('userName');

        var metadata = {
            _id: id,
            filename: filename,
            mimeType: 'image/jpeg',
            owner: owner,
        };

        Kinvey.Files.upload(fileContent, metadata)
            .then(function () {
                console.log('image upload successfully')
            }).catch(handleAjaxError)
    }

    // all cars page
    function allCarsPage() {
        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/cars',
            headers: getKinveyUserAuthHeaders()
        }).then(function (cars) {
            for (let car of cars) {
                var template = allCarsTemplate(car)
                $('#allCarsView').append(template)
                getAllCarImage(car.id)
            }
        }).catch(handleAjaxError)
    }

    function getAllCarImage(id) {
        Kinvey.Files.stream(id)
            .then(function (file) {
                var url = file._downloadURL;
                $(`#all${id}`).attr("src", url);
            }).catch(handleAjaxError)
    }

    // my cars View
    function myCarsPage() {
        $('#myCarsView').empty()

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + `/cars?query={"owner":"${sessionStorage.getItem('userName')}"}`,
            headers: getKinveyUserAuthHeaders()
        }).then(function (cars) {
            if (cars.length === 0) {
                let section = $(`<section id="noMyCarView">
                                    <section class="no-car" >
                                        <div class="no-car-container">
                                            <h1>Post your first car</h1>
                                            <button class="btn no-car-btn">Click here</button>
                                        </div>
                                    </section>
                            </section>`)
                $('#noMyCarView').append(section)
                $('.no-car-btn').on('click', function () {
                    postCarView()
                });
                showMyCarsView();
                $('#myCarsView').hide()
                $('#noMyCarView').show()
            }

            for (let car of cars) {
                var template = myCarTemplate(car)
                $('#myCarsView').append(template)
                $(`#removeCar${car.id}`).on('click', function () {
                    deleteCar(car);
                });

                getMyCarImage(car.id)
            }
        }).catch(handleAjaxError)
    }

    function getMyCarImage(id) {
        Kinvey.Files.stream(id)
            .then(function (file) {
                var url = file._downloadURL;
                $(`#${id}`).attr("src", url);
            }).catch(handleAjaxError)

    }

    // top 10 cars-sorted
    function sortedDesByPower(a, b) {
        if (Number(a.power) > Number(b.power)) {
            return -1;
        }
        if (Number(a.power) < Number(b.power)) {
            return 1;
        }
        return 0;
    }

    function topCars() {
        $('#topCarsContainer').empty()
        $('.btn-sorted').css('background', '#007bff')
        $('#powerDes').css('background', 'orange')

        if (sessionStorage.getItem('authToken') !== null) {
            $.ajax({
                method: "GET",
                url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/cars',
                headers: getKinveyUserAuthHeaders()
            }).then(function (cars) {
                localStorage.setItem('allCars', JSON.stringify(cars))

                if (cars.length === 0) {
                    let div = $('<div class="no-car">No cars to show</div>')
                    $('#topCarsContainer').append(div)
                }

                cars.sort(sortedDesByPower)
                for (let i = 0; i < 10; i++) {
                    var template = topCarTemplate(i + 1, cars[i])
                    $('#topCarsContainer').append(template)
                    getTopCarImage(cars[i].id)
                }
            }).catch(handleAjaxError)
        }
    }

    function orderCarsByPowerDes() {
        let cars = JSON.parse(localStorage.getItem('allCars'))

        $('#topCarsContainer').empty()
        $('.btn-sorted').css('background', '#007bff')
        $('#powerDes').css('background', 'orange')

        cars.sort(sortedDesByPower)
        for (let i = 0; i < 10; i++) {
            var template = topCarTemplate(i + 1, cars[i])
            $('#topCarsContainer').append(template)
            getTopCarImage(cars[i].id)
        }
    }

    function sortedAscByPower(a, b) {
        if (Number(a.power) < Number(b.power)) {
            return -1;
        }
        if (Number(a.power) > Number(b.power)) {
            return 1;
        }
        return 0;
    }

    function orderCarsByPowerAsc() {
        let cars = JSON.parse(localStorage.getItem('allCars'))

        $('#topCarsContainer').empty()
        $('.btn-sorted').css('background', '#007bff')
        $('#powerAsc').css('background', 'orange')

        cars.sort(sortedAscByPower)
        for (let i = 0; i < 10; i++) {
            var template = topCarTemplate(i + 1, cars[i])
            $('#topCarsContainer').append(template)
            getTopCarImage(cars[i].id)
        }
    }

    function sortedDesByYear(a, b) {
        if (Number(a.year) < Number(b.year)) {
            return -1;
        }
        if (Number(a.year) > Number(b.year)) {
            return 1;
        }
        return 0;
    }

    function orderCarsByYearDes() {
        let cars = JSON.parse(localStorage.getItem('allCars'))

        $('#topCarsContainer').empty()
        $('.btn-sorted').css('background', '#007bff')
        $('#yearDes').css('background', 'orange')

        cars.sort(sortedDesByYear)
        for (let i = 0; i < 10; i++) {
            var template = topCarTemplate(i + 1, cars[i])
            $('#topCarsContainer').append(template)
            getTopCarImage(cars[i].id)
        }
    }

    function sortedAscByYear(a, b) {
        if (Number(a.year) > Number(b.year)) {
            return -1;
        }
        if (Number(a.year) < Number(b.year)) {
            return 1;
        }
        return 0;
    }

    function orderCarsByYearAsc() {
        let cars = JSON.parse(localStorage.getItem('allCars'))
        $('#topCarsContainer').empty()
        $('.btn-sorted').css('background', '#007bff')
        $('#yearAsc').css('background', 'orange')

        cars.sort(sortedAscByYear)
        for (let i = 0; i < 10; i++) {
            var template = topCarTemplate(i + 1, cars[i])

            $('#topCarsContainer').append(template)
            getTopCarImage(cars[i].id)
        }
    }

    function getTopCarImage(id) {
        Kinvey.Files.stream(id)
            .then(function (file) {
                var url = file._downloadURL;
                $(`#top${id}`).attr("src", url);
            }).catch(handleAjaxError)
    }

    // templates
    function allCarsTemplate(car) {
        var { id, owner, brand, model, year, power, description } = car
        var template = $(` <article class="top-car-container">
                    <section class="my-car">
                        <article class="img-info-container">
                            <article class="car-img">
                                <img id="all${id}" alt="">
                            </article>
                            <article class="car-info">
                            <div class="owner-allcars"><b>Owner:</b> ${owner}</div>
                                <div class="info-line">
                                    <p><b>Brand:</b> ${brand}</p>
                                    <p><b>Model:</b> ${model}</p>
                                    <p><b>Year:</b> ${year}</p>
                                    <p><b>Power:</b> ${power} hp</p>
                                </div>
                                
                                <div class="car-description">
                                    <p><b>Description</b></p>
                                    <p>${description}</p>
                                </div>
                            </article>
                        </article>
                    </section>
                </article>`)
        return template
    }

    function myCarTemplate(car) {
        var { id, brand, model, year, power, description, id } = car
        var template = $(`<section class="my-car">
                   <article class="img-info-container">
                       <article class="car-img">
                           <img id="${id}" alt="">
                       </article>
                       <article class="car-info">                   
                           <div class="info-line">
                               <p><b>Brand:</b> ${brand}</p>
                               <p><b>Model:</b> ${model}</p>
                               <p><b>Year:</b> ${year}</p>
                               <p><b>Power:</b> ${power} hp</p>
                           </div>
                           
                           <div class="car-description">
                               <p><b>Description</b></p>
                               <p>${description}</p>
                           </div>
                           <div class="info-line" id="removeUpdateButtons">
                               <button id="removeCar${id}" class="btn remove-btn">Remove car</button>
                           </div>
                       </article>
                   </article>
                </section>`)

        return template
    }

    function topCarTemplate(number, car) {
        var { owner, id, brand, model, year, power, description } = car
        var template = $(`<article class="top-car-container">
                <div class="car-position">
                    <h2>${number}</h2>
                    <p><b>Owner:</b> ${owner}</p>  
                </div>      
                <section class="my-car">
                    <article class="img-info-container">
                        <article class="car-img">
                            <img id="top${id}" alt="">
                        </article>
                        <article class="car-info">
                               <div class="info-line">
                               <p><b>Brand:</b> ${brand}</p>
                               <p><b>Model:</b> ${model}</p>
                               <p><b>Year:</b> ${year}</p>
                               <p><b>Power:</b> ${power} hp</p>
                           </div>
                           <div class="car-description">
                               <p><b>Description</b></p>
                               <p>${description}</p>
                           </div>
                       </article>
                    </article>
                 </section>
             </article>`)
        return template
    }


    // delete car 
    function deleteCar(car) {
        $.ajax({
            method: "DELETE",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/cars/" + car._id,
            headers: getKinveyUserAuthHeaders()
        }).then(function () {
            deleteCarImage(car.id)
            myCarsPage()
            showInfo('Car removed successfully!')
        }).catch(handleAjaxError)
    }

    function deleteCarImage(id) {
        Kinvey.Files.removeById(id)
            .then(function () {
            }).catch(handleAjaxError)
    }

    // notifications 
    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show()
        },
        ajaxStop: function () {
            $('#loadingBox').hide()
        }
    })

    $('#infoBox', '#errorBox').on('click', function () {
        $(this).fadeOut()
    })

    function showInfo(message) {
        $("#infoBox > span").text(message)
        $("#infoBox").show()
        setTimeout(function () {
            $("#infoBox").hide()
        }, 3000)
    }

    function showError(message) {
        $("#errorBox > span").text(message)
        $("#errorBox").show()
        setTimeout(function () {
            $("#errorBox").hide()
        }, 3000)
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }
}
