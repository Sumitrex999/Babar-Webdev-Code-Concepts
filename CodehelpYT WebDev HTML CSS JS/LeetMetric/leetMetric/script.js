document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {

        if(username.trim() === ""){
            alert("Username cannot be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_]{1,20}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent = "Searching..";
            searchButton.disabled = true;
            statsContainer.style.setProperty("display", "block");

            const response = await fetch(url);
            if(!response.ok){
                throw new Error("unable to fetch the User details");
            }
            const passedData = await response.json();
            console.log("logging passedData:",passedData);

            displayUserData(passedData);
        }
        catch(error){
            statsContainer.innerHTML = `<p>${error.message}</p>`
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
        
        
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved / total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;

    }

    function displayUserData(passedData){
        const totalQues = passedData.totalQuestions;
        const totalEasyQues = passedData.totalEasy;
        const totalMediumQues = passedData.totalMedium;
        const totalHardQues = passedData.totalHard;
        const solvedTotalQues = passedData.totalSolved;
        const solvedTotalEasyQues = passedData.easySolved;
        const solvedTotalMediumQues = passedData.mediumSolved;
        const solvedTotalHardQues = passedData.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            {label: "Acceptance Rate", value: passedData.acceptanceRate},
            {label: "Ranking", value: passedData.ranking},
            {label:"Contribution Points",  value: passedData.contributionPoints},
        ];

        console.log("logging cardData:", cardsData);

            cardStatsContainer.innerHTML = cardsData.map(
                data => {
                    return `
                    <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
                }
            ).join('');
    }

    searchButton.addEventListener("click", function() {
        const username = usernameInput.value;
        console.log("logging username:", username );
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})
