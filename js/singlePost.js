const queryString = document.location.search;
const searchParams = new URLSearchParams(queryString);
const id = searchParams.get("id");
console.log(id)

const user = localStorage.getItem('username');

const API_BASE_URL = "https://nf-api.onrender.com/api/v1";
const singlePostsEndpoint = '/social/posts/';
const author = "?_author=true"; // GET
const singlePostURL = `${API_BASE_URL}${singlePostsEndpoint}${id}${author}`;

const outDiv = document.querySelector("div#container")

async function getSinglePost (url) {
    try {
        const accessToken = localStorage.getItem('accessToken'); 
        //console.log(accessToken)
        const options = {
            method: 'GET', 
            headers: {
                 "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        //console.log(url, options);

        const response = await fetch(url, options); 
        console.log(response);
        const post = await response.json();
        console.log(post);
        listPost(post)

    } catch(error) {
        console.warn(error);
    }

};


function listPost(post) {

    let date = new Date(post.created);
        let formatedDate = date.toLocaleString("en-US", {
            dateStyle: 'medium',
            timeStyle: 'medium',
            hour12: false,
        });
    //console.log (posts);
    outDiv.innerHTML = "";
    let newDivs = "";

    const editDelete = `<div class="dropdown d-flex justify-content-end pt-2">
        <button class="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
          Update
        </button>
        <div class="dropdown-menu" aria-labelledby="Edit">
          <a href="updatepost.html?id=${post.id}" class="btn btn-primary dropdown-item" id="updateBtn" data-update="${post.id}">Edit</a>
          <button class="dropdown-item" id="deleteBtn" data-delete="${post.id}">Delete</button>
        </div>
      </div>
      `
        //console.log(object);      
        newDivs += `
        <div class="card mb-3 border-0">
            <div class="card-header pt-3 bg-white d-flex justify-content-between">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text"><small class="text-muted">#${post.id}</small></p>
            </div>
            <div class="card-body border-0">
                <p class="card-text">${post.body}</p>
                <img src="${post.media}" class="card-img-top" alt="">
                <div class="d-flex justify-content-between">
                <p class="card-text"><small>Author: ${post.author.name}</small></p>
                <p class="small">${formatedDate}</p>
                ${user === post.author.name ? editDelete :""}
                </div>
            </div>
        </div>`;
        /* image code
            <div class="col-3 col-lg-2 p-3">
                <img src="${object.image}"
                class="img-thumbnail float-start rounded-circle ratio-1x1"  alt="...">
            </div>
        */
    
    outDiv.innerHTML = newDivs;

    const deleteBtn = document.querySelectorAll("button#deleteBtn")

    deleteBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-delete");
            if ( confirm('Are you sure you want to delete post?')){
                deletePosts(API_BASE_URL + singlePostsEndpoint + id)
                }
    
        })
    });

};

async function deletePosts (url) {
    try {
        const accessToken = localStorage.getItem('accessToken'); 
        //console.log(accessToken)
        const options = {
            method: 'DELETE', 
            headers: {
                 "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        //console.log(url, options);

        const response = await fetch(url, options); 
        console.log(response);
        const posts = await response.json();
        console.log(posts);
        window.location.href="homepage.html";

    } catch(error) {
        console.warn(error);
    }
};


getSinglePost(singlePostURL);
