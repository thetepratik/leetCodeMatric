


document.addEventListener("DOMContentLoaded", function(){

     const searchButton = document.getElementById("search_btn");
     const usernameInput = document.getElementById("user_input");
     const statsContainer = document.querySelector(".stats_container");
     const easyProgressCircle = document.querySelector(".easy_progress");
     const mediumProgressCircle = document.querySelector(".medium_progress");
     const hardProgressCircle = document.querySelector(".hard_progress");
     const easyLabel = document.getElementById("easy_label");
     const mediumLabel = document.getElementById("medium_label");
     const hardLabel = document.getElementById("hard_label");
     const cardStatsContainer = document.querySelector(".state_card");


     //return true or false
     function validateUsername(username){
          if(username.trim() === ""){
               alert("Username should not be empty...");
               return false;
          }
          const regex = /^[a-zA-Z0-9_-]{1,30}$/;

          
          const isMatching = regex.test(username);
          if(!isMatching){
               alert("Invalid username");
          }
          return isMatching;
     }


     async function fetchUserDetails(username){
          // const url = `https://leetcode.com/graphql`
          try{


               searchButton.textContent = "Searching...";
               searchButton.disabled = true;
               statsContainer.classList.add("hidden");

               const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
               const targetUrl = `https://leetcode.com/graphql/`;
               const myHeaders = new Headers();
               myHeaders.append("content-type", "application/json");

               const graphql = JSON.stringify({
                   query: `query getUserProfile($username: String!) {
                         allQuestionsCount {
                         difficulty
                         count
                         }
                         matchedUser(username: $username) {
                         submitStats: submitStatsGlobal {
                              acSubmissionNum {
                              difficulty
                              count
                              submissions
                              }
                              totalSubmissionNum {
                              difficulty
                              count
                              submissions
                              }
                         }
                         }
                         }`,
                              variables : {"username" : `${username}` }
               })

               const requestOptions = {
                    method : "POST",
                    headers: myHeaders,
                    body : graphql,
                    redirect : "follow"
               };

               const response = await fetch(proxyUrl+targetUrl, requestOptions);


               if(!response.ok){
                    throw new Error("Unable to fetch the user details");
               }
               const parseData = await response.json();
               console.log("Logging data: ", parseData);


               displayUserData(parseData);


          }catch(error)
          {
               statsContainer.innerHTML = `<p> No data found</p>`
          } finally{

               searchButton.textContent = "Search";
               searchButton.disabled = false;
          }
     } 

     function updateProgress(solved, total, label, circle){

          const progressDegree = (solved/total)*100;
          circle.style.setProperty("--progress-degree", `${progressDegree}%`);
          label.textContent = `${solved}/${total}`;
     }



     function displayUserData(parseData) {
     const totalQues = parseData.data.allQuestionsCount[0].count;
     const totalEasyQues = parseData.data.allQuestionsCount[1].count;
     const totalMediumQues = parseData.data.allQuestionsCount[2].count;
     const totalHardQues = parseData.data.allQuestionsCount[3].count;

     const solvedTotalEasyQues = parseData.data.matchedUser.submitStats.acSubmissionNum[0].count;
     const solvedTotalMediumQues = parseData.data.matchedUser.submitStats.acSubmissionNum[1].count;
     const solvedTotalHardQues = parseData.data.matchedUser.submitStats.acSubmissionNum[2].count;

     updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
     updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
     updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

     const cardsData = [
    { label: "Total Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
    { label: "Total Easy Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
    { label: "Total Medium Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
    { label: "Total Hard Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions }
  ];

  console.log("card data:", cardsData);

  cardStatsContainer.innerHTML = cardsData
    .map(data => `
      <div class="card">
        <h3>${data.label}</h3>
        <p>${data.value}</p>
      </div>
    `)
    .join("");
}


     searchButton.addEventListener('click', function(){
          const username = usernameInput.value;
          console.log("loggin username: ", username);
          if(validateUsername(username)){
               fetchUserDetails(username);
          }
     })

})