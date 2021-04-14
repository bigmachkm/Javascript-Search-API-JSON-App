const resultsContainer = document.getElementById("search-results");
const searchInput = document.getElementById("search-input");
const contentResults = document.getElementById("content-items");
const clearSearch = document.getElementById("clear-button");

// Fetch the content from the api

async function getContent() {
  const res = await fetch(`https://api.srecms.co.uk/api/v1/notes`);
  const data = await res.json();
  return data.notes;
}

function formatDate(date) {
  let newDate = new Date(date);
  return newDate.toDateString();
}

// Show data in DOM
async function showContent() {
  const data = await getContent();
  data.forEach((item) => {
    let created = formatDate(item.createdAt);
    let updated = formatDate(item.updatedAt);
    const element = document.createElement("div");
    element.classList.add("post-wrapper");
    element.innerHTML = `
      <div class="post-top">
            <div class="number">${item.id}</div>
            <div class="post-info">
              <h2>${item.title}</h2>
              <p class="post-body">
                ${item.details}
              </p>
            </div>
          </div>
          <div class="post-footer-info">
            <div class="category"><strong>Category: </strong> ${item.category}</div>
            <div class="created"><strong>Created: </strong> ${created}</div>
            <div class="updated"><strong>Last Updated:</strong> ${updated}</div>
          </div>
      `;
    contentResults.appendChild(element);
  });
}

showContent();

const searchResults = async (searchText) => {
  const data = await getContent();
  let matches = await data.filter((post) => {
    const regex = new RegExp(`${searchText}`, "gi");
    return post.title.match(regex) || post.details.match(regex);
  });

  if (searchText.length <= 0) {
    matches = [];
    resultsContainer.innerHTML = "Nothing found";
  }
  outputHTML(matches);
};

const outputHTML = async (matches) => {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) =>
          `
            <div class="post-top">
            <div class="number">${match.id}</div>
            <div class="post-info">
              <h2>${match.title}</h2>
              <p class="post-body">
                ${match.details}
              </p>
            </div>
          </div>
          <div class="post-footer-info">
            <div class="category"><strong>Category: </strong> ${match.category}</div>
            <div class="created"><strong>Created: </strong> ${match.created}</div>
            <div class="updated"><strong>Last Updated:</strong> ${match.updated}</div>
          </div>         
            `
      )
      .join("");
    resultsContainer.innerHTML = html;
  }
};

searchInput.addEventListener("input", () => {
  contentResults.classList.add("fade-out");
  searchResults(searchInput.value);
  if (searchInput.value == "") {
    contentResults.classList.remove("fade-out");
  }
});
